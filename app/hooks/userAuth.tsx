import { useSelector } from "react-redux";
export default function UserAuth() {
    const {lab} = useSelector((state: any) => state.auth);
    if (lab) {
        return true;
    } else {
        return false;
    }
}