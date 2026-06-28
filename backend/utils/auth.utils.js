import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
// Cifrar a password antes de guardar na BD
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Comparar a password inserida com a cifrada na BD
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

// Gerar o Token JWT para enviar ao Postman
export function generateToken(user) {
  return jwt.sign(
    {
      sub: user._id, // ID único da conta global
      username: user.username,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }, // Token válido por 7 dia
  )
}

// Verificar se o Token JWT é valido
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Acesso negado. Token não fornecido.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.sub,
      username: decoded.username,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "O token expirou. Faz login novamente.",
      });
    }

    return res.status(401).json({
      message: "Token inválido.",
    });
  }
};