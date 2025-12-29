// controllers/contactController.js
export const contactDoctor = async (req, res) => {
    try {
      const { name, email, message, doctorId } = req.body;
      // You can also handle file upload if needed (e.g. req.file or req.files)
      console.log("Contact submission:", { name, email, message, doctorId });
      res.json({ success: true, message: "Contact received!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  