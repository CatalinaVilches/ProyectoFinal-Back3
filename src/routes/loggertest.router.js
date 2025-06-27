import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    // Mensajes de log con distintos niveles para pruebas
    req.logger.debug("Mensaje de depuración generado.");
    req.logger.http("Petición HTTP capturada.");
    req.logger.info("Mensaje informativo registrado.");
    req.logger.warning("Se detectó una advertencia.");
    req.logger.error("Se ha producido un error.");
    req.logger.fatal("Error crítico: sistema detenido.");

    res.send("Logs generados con éxito.");
});

export default router;
