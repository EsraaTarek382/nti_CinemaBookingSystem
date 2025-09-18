
import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'

const verifyToken = async (req,res,next)=>{
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token' });
    }

   
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

   
    const loggedInUser = await User.findById(data.id);
    if (!loggedInUser) {
      return res.status(401).json({ error: 'User not found' });
    }

   
    req.user = loggedInUser;      
    req.role = loggedInUser.role;   
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Token invalid or expired' });
  }
}

export default verifyToken;
