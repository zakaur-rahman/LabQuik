import { useSelector } from "react-redux";

export default function userAuth() {
    const auth = useSelector((state: any) => state.auth);
    return Boolean(auth?.lab);
}