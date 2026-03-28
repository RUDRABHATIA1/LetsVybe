import jwt from 'jsonwebtoken'

const isAuth = async(req,res,next)=>{
    try {
        // Try to get token from cookies first, then from Authorization header
        let token = req.cookies.token
        
        if (!token) {
            // Check Authorization header (Bearer token format)
            const authHeader = req.headers.authorization
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7) // Remove 'Bearer ' prefix
            }
        }
        
        if(!token){
            return res.status(400).json({message:"Token is Not Found"})
        }

        const verifyToken = await jwt.verify(token,process.env.JWT_SECRET)

        req.userId = verifyToken.userId

        next()

    } catch (error) {
        return res.status(500).json({message:`isAuth Error: ${error.message}`}) 
    }
}

export default isAuth 