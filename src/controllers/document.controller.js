import Document from '../models/document.js';
import { storeFileAndReturnNameBase64 } from '../utils/fileSystem.js';

const fileFields = [
  'groomId',
  'groomPassport',
  'groomBirthCertificateOrMarksheet',
  'brideId',
  'bridePassport',
  'brideBirthCertificateOrMarksheet',
  'marriageProofPhoto',
  'marriageProofCoupleImage',
  'marriageProofInvitation',
  'religiousCertificateImage',
  'witness1AadharFront',
  'witness1AadharBack',
  'witness1PanCardPhoto',
  'witness2AadharFront',
  'witness2AadharBack',
  'witness2PanCardPhoto',
  'signatureImageGroom',
  'signatureImageBride',
  'signatureImageWitness1',
  'signatureImageWitness2',
];

const isBase64 = (v) => typeof v === 'string' && v.includes('base64');

const processFiles = async (body) => {
  for (const field of fileFields) {
    const value = body[field];
    if (value && typeof value === 'string' && isBase64(value)) {
      body[field] = await storeFileAndReturnNameBase64(value);
    }
  }
};

/* ============================================================
   POST /v1/documents  — user submits or updates their form
   ============================================================ */
export const submitDocument = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await processFiles(req.body);

    const existing = await Document.findOne({ userId, isDeleted: false });

    if (existing) {
      const updated = await Document.findByIdAndUpdate(
        existing._id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      return res.json({
        success: true,
        message: 'Document updated',
        data: updated,
      });
    }

    const doc = await Document.create({ ...req.body, userId });
    res.status(201).json({
      success: true,
      message: 'Document submitted',
      data: doc,
    });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET /v1/documents/me  — logged-in user sees their form
   ============================================================ */
export const getMyDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({
      userId: req.user._id,
      isDeleted: false,
    });
    res.json({ success: true, data: doc || null });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET /v1/documents  — admin sees all submissions
   ============================================================ */
export const getAllDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find({ isDeleted: false })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: docs, total: docs.length });
  } catch (err) {
    next(err);
  }
};

/* ============================================================
   GET /v1/documents/:id  — admin sees one submission in full
   ============================================================ */
export const getDocumentById = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).populate(
      'userId',
      'name email phone'
    );
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};