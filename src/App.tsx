import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/Login.tsx";
import {RoundsList} from "./pages/RoundsList.tsx";
import {Round} from "./pages/Round.tsx";
import {PrivateRoute} from "./router/privateRoute.tsx";
import {AuthProvider} from "./providers/auth.provider.tsx";
import {Header} from "./components/header.tsx";
import {Footer} from "./components/footer.tsx";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.locale('ru');
dayjs.extend(utc);
dayjs.extend(timezone);

function App() {

    return (
        <AuthProvider>
            <div className="flex flex-col items-center justify-between h-screen">
                <Header />
                <BrowserRouter>
                    <Routes>
                        <Route path='/login' element={<Login/>}/>
                        <Route element={<PrivateRoute/>}>
                            <Route path='/round/:uuid' element={<Round/>}/>
                        </Route>
                        <Route element={<PrivateRoute/>}>
                            <Route path='/' element={<RoundsList/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
                <Footer/>
            </div>
        </AuthProvider>
    )
}

export default App
