


const allowedTo = (allowedRole)=>{
    return (req,res,next)=>{
        // console.log(req.role)
        if(req.role !== allowedRole) return res.status(403).json({error: "You haven't access"})
        next()
    }
}


export default allowedTo