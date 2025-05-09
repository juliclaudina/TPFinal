import express from 'express';
import { connectDB } from './config/dbConfig.mjs';
import paisRoutes from './routes/paisRoutes.mjs';
import path from "path";
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import { cargarPaises } from './services/PaisService.mjs'; 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB y carga inicial de países
async function startServer() {
    try {
        await connectDB();

        //  Cargar los países UNA SOLA VEZ
        await cargarPaises();

        // Middleware
        app.use(express.urlencoded({ extended: true }));
        app.use(methodOverride('_method'));
        app.use(express.static(path.join(process.cwd(), "public")));

        // Configurar EJS + Layout
        app.set('view engine', 'ejs');
        app.set('views', path.resolve('./views'));
        app.use(expressLayouts);
        app.set('layout', 'layout');

        // Rutas
        app.use('/api', paisRoutes);
        app.get('/', (req, res) => {
            res.render('index', { title: 'Pagina principal' });
        });
        app.get('/about', (req, res) => {
            res.render('about', { title: 'Acerca de Nosotros' });
        });
        app.get('/contact', (req, res) => {
            res.render('contact', { title: 'Contactanos' });
        });

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al iniciar el servidor:", error.message);
    }
}

startServer();
