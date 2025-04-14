module.exports = (req, res, next) => {
  // Middleware para manejar CORS de manera efectiva en Vercel
  if (
    req.headers["x-forwarded-proto"] &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }

  // Agregar encabezados CORS adicionales si es necesario
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Si es una solicitud OPTIONS, responder de inmediato
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return next();
};
