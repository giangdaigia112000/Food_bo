import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getStoreLocal } from "../utils/localStore";
import Loading from "../components/Loading";
import { checkMe } from "../store/slice/loginSlice";

const AuthenticatedRoute = ({ children, pathAfterFailure }: any) => {
    const router = useRouter();
    const { user, loading } = useAppSelector((state) => state.login);
    const dispatch = useAppDispatch();
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [checkUser, setCheckUser] = useState<boolean>(false);

    useEffect(() => {
        const token = getStoreLocal("token");
        if (!token) return;
        dispatch(checkMe());
    }, []);

    useEffect(() => {
        const token = getStoreLocal("token");
        authCheck(router.pathname, token);
        router.events.on("routeChangeStart", hideContent);
        router.events.on("routeChangeComplete", authCheck);
        return () => {
            router.events.off("routeChangeStart", hideContent);
            router.events.off("routeChangeComplete", authCheck);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkUser]);

    useEffect(() => {
        if (user) setCheckUser(true);
    }, [user]);

    const hideContent = () => {
        if (checkUser) return;
        setAuthorized(false);
    };

    const authCheck = (url: any, token: any) => {
        const path = url.split("?")[0];
        if (!token && path != pathAfterFailure) {
            setAuthorized(false);
            router.push("/login", "/login", { locale: router.locale });
        } else {
            setAuthorized(true);
        }
    };
    return (
        <>
            {loading && <Loading />}
            {authorized && children}
        </>
    );
};

export default AuthenticatedRoute;
