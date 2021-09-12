export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'senhasupersecreta' as string,
    expiresIn: '1d'
  }
}
