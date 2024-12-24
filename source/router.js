import session from "express-session";
import _FileStore from 'session-file-store';
import {flash} from "express-flash-message";
import cookieParser from "cookie-parser";
import { Router, urlencoded, static as staticMiddleware } from "express";
import methodOverride from 'method-override';
import { mainPage, detailPage, addPage, add, setDone, remove, setOrder, addendumWrapper } from "./controllers/todos.js";
import { requestToContext, handleErrors, getErrors, extendFlashAPI } from "./middleware.js";
import { todoV } from "./validators.js";
import { mainErrorHandler, error500Handler } from "./error-handlers.js";

const FileStore = _FileStore(session);
const router = Router();

router.use('/uploaded', staticMiddleware('storage/uploaded'));
router.use(staticMiddleware('public'));
router.use(urlencoded({extended: true}));
router.use(methodOverride('_method'));

router.use(cookieParser());

router.use(session({
    store: new FileStore({
        path: "./storage/sessions",
        reapAsync: true,
        reapSyncFallback: true,
        fallbackSessionFn: ()=>{
            return;
        },
        logFn: ()=>{}
    }),
    secret: 'hedgehog',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60
    }
}));
router.use(flash({
    sessionKeyName: 'flash-message'
}));

router.use(extendFlashAPI);
router.use(requestToContext);
router.get('/add', getErrors, addPage);
router.post('/add', addendumWrapper, todoV, handleErrors, add);
router.get('/:id', detailPage);
router.put('/:id', setDone);
router.delete('/:id', remove);
router.post('/setorder', setOrder);     
router.get('/', mainPage);

router.use(mainErrorHandler, error500Handler);

export default router;
