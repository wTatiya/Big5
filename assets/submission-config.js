// Local / branch deploy default. For production, prefer GitHub Actions (see README):
// repository secrets BIG5_WEBHOOK_URL and BIG5_WEBHOOK_TOKEN overwrite this file on deploy.
window.BIG5_OWNER_SUBMISSION_CONFIG = {
  enabled: false,
  webhookUrl: "",
  webhookToken: "",
};
