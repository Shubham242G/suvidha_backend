import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Groom
    groomId: String,
    groomPassport: String,
    groomBirthCertificateOrMarksheet: String,

    // Bride
    brideId: String,
    bridePassport: String,
    brideBirthCertificateOrMarksheet: String,

    // Marriage proof
    marriageProofPhoto: String,
    marriageProofCoupleImage: String,
    marriageProofInvitation: String,
    religiousCertificateImage: String,

    // Witness 1
    witness1AadharFront: String,
    witness1AadharBack: String,
    witness1PanCardPhoto: String,

    // Witness 2
    witness2AadharFront: String,
    witness2AadharBack: String,
    witness2PanCardPhoto: String,

    // Signatures
    signatureImageGroom: String,
    signatureImageBride: String,
    signatureImageWitness1: String,
    signatureImageWitness2: String,

    // Verification
    isDocumentVerified: {
      type: Boolean,
      default: false,
    },
    remark: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export default mongoose.model('Document', documentSchema);