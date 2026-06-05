import api from "../api";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {

        try {

            const refresh = localStorage.getItem("refresh");
            const access = localStorage.getItem("access");

            await api.post("/api/user/logout/",
                {
                    refresh: refresh
                },
                {
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                }
            );

        } catch (error) {
            console.log(error);
        } finally {

            localStorage.removeItem("access");
            localStorage.removeItem("refresh");

            navigate("/");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
            Logout
        </button>
    );
};

export default LogoutButton;