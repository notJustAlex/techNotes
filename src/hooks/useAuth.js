import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";
import { useGetUsersQuery } from "../features/users/usersApiSlice";

const useAuth = () => {
	const token = useSelector(selectCurrentToken);

	let username = "";
	let roles = [];
	let isManager = false;
	let isAdmin = false;
	let status = "Employee";

	const { users } = useGetUsersQuery("usersList", {
		refetchOnMountOrArgChange: true,
		selectFromResult: ({ data }) => ({
			users: data?.ids.map((id) => data?.entities[id]),
		}),
	});

	if (token) {
		const decoded = jwtDecode(token);
		const { id } = decoded.UserInfo;

		const user = users?.find((user) => user.id === id);

		if (user) {
			username = user?.username;
			roles = user?.roles;

			isManager = user?.roles.includes("Manager");
			isAdmin = user?.roles.includes("Admin");

			if (isManager) status = "Manager";
			if (isAdmin) status = "Admin";
		}

		return { username, roles, status, isManager, isAdmin };
	}

	return { username, roles, isManager, isAdmin, status };
};

export default useAuth;
