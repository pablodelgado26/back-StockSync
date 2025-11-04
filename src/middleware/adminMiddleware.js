// Middleware para verificar se o usuário é admin
const adminMiddleware = (req, res, next) => {
    try {
        // O usuário já foi autenticado pelo authMiddleware
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Não autenticado" });
        }

        // Verificar se o usuário é admin
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                error: "Acesso negado. Apenas administradores podem realizar esta ação." 
            });
        }

        next();
    } catch (error) {
        console.error("Erro no middleware de admin:", error);
        return res.status(500).json({ error: "Erro ao verificar permissões" });
    }
};

export default adminMiddleware;
