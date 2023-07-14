import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register
export const register = async (req, res) => {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = await new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            picture: req.file.filename,
            friends: req.body.friends,
            location: req.body.location,
            occupation: req.body.occupation,
            about: req.body.about,
            viewedprofile: req.body.viewedprofile,
            lastseen: req.body.lastseen,
            isOnline: req.body.isOnline,
        });

        // save user and respond
        const user = await newUser.save();
        res.status(201).json(user);
    } catch(err) {
        res.status(500).json(err);
    }
}

// Login
/* LOGGING IN */
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

