const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: JSON.parse(localStorage.getItem('user')) || {},
			message: null,
			host: process.env.BACKEND_URL,
			email: '',
			isLogged: Boolean(localStorage.getItem('token')),
			transactions: [],
			budgets: [],
			balance: {},
			connections: [],
			fixedExpenses: [],
			token: localStorage.getItem('token') || '',
			sources: [],
			categories: [],
			currentTransaction: {},
		},

		actions: {
			login: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/login`;
				const options = {
					method: 'POST',
					headers: {
						"Content-Type": 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error', response.status, response.statusText);
					return;
				}
				const data = await response.json();
				localStorage.setItem('token', data.access_token);
				localStorage.setItem('user', JSON.stringify(data.results));
				setStore({ token: data.access_token, user: data.results, isLogged: true });
			},
			getToken: () => {
				// esto funciona bien (lo hago trayendo el token desde consola)
				let token = getStore().token;
				console.log("Token desde el store:", token);

				if (!token) {
					token = localStorage.getItem("jwt_token");
					console.log("Token desde el localStorage:", token);
					if (token) {
						setStore({ token });
					}
					console.log("Token desde el store:", token);
				}
				console.log("Token final:", token);
				return token;
			},
			getMessage: async () => {
				const uri = `${process.env.BACKEND_URL}/api/hello`
				const options = {
					method: 'GET'
				}
				const response = await fetch(uri, options)
				if (!response.ok) {
					console.log("Error loading message from backend", response.status)
					return
				}
				const data = await response.json()
				setStore({ message: data.message })
				return data;
			},
			// actions for ExpenseVue
			is_Logged: async () => {
				const uri = ``
				const options = ""
			},
			setCurrentuser: (user) => {
				setStore({ user: user })
			},
			Saveuser: (user) => {
				const storedUser = localStorage.getItem('user');
				if (storedUser) {
					try {
						const localuser = localStorage.getItem('user')
						setStore({ user: localuser })
					} catch (error) {
						console.error('Error al analizar el nombre de usuario almacenado:', error);
						setStore({ user: '' });
					}
					return
				}
				setStore({ user: user })
				localStorage.setItem('user', JSON.stringify(user))
			},
			clearuser: () => {
				setStore({ user: '' });
				localStorage.removeItem('user');
			},
			getEmail: (email) => {
				setStore({ email: email })
			},
			saveEmail: (email) => {
				const storeduser = localStorage.getItem('email');
				if (storeduser) {
					try {
						const localuser = localStorage.getItem('email')
						setStore({ email: localuser })
					} catch (error) {
						console.error('Error al analizar el email del usuario almacenado:', error);
						setStore({ email: '' });
					}
					return
				}
				setStore({ emaile: user })
				localStorage.setItem('email', JSON.stringify(email))
			},
			clearEmail: () => {
				setStore({ email: '' });
				localStorage.removeItem('email');
			},
			edituser: async (id, dataToSend) => {
				const uri = ``;
				const options = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(dataToSend),
				};
				const response = await fetch(uri, options);
				if (!options.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				getActions().setCurrentuser({});
				getActions().getuser();
			},
			deleteUser: async (id) => {
				const uri = ``;
				const options = {
					method: 'DELETE',
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				};
				getActions().getuser();
			},
			setCurrentTransaction: (transaction) => { setStore({ currentTransaction: transaction }) },
			getTransactions: async () => {
				const uri = `${getStore().host}/api/transactions`;
				const token = localStorage.getItem("jwt_token");

				console.log("URI de la solicitud:", uri);
				console.log("Token utilizado:", token);

				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				};

				const response = await fetch(uri, options);

				console.log("Estado de la respuesta:", response.status, response.statusText);

				if (!response.ok) {
					console.log('Error en la respuesta:', response.status, response.statusText);
					return;
				}

				const data = await response.json();
				setStore({ transactions: data.results });
				console.log("estas son las transactions", getStore().transactions)

			},
			createTransaction: async (transactionData) => {
				const uri = `${getStore().host}/api/transactions`;
				const token = localStorage.getItem("jwt_token");
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify(transactionData),
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', error.status, error.statusText);
					return
				}
				const data = await response.json();
				getActions().getTransactions();
			},
			editTransaction: async (id, dataToSend) => {
				const uri = `${getStore().host}/api/transactions/${id}`;
				const token = localStorage.getItem("jwt_token");
				const options = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
					},
					body: JSON.stringify(dataToSend),
				};
				const response = await fetch(uri, options);
				if (!options.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				getActions().setCurrentTransactions({});
				getActions().getTransactions();
			},
			deleteTransaction: async (id) => {
				const uri = `${getStore().host}/api/transactions/${id}`;
				const token = localStorage.getItem("jwt_token");
				const options = {
					method: 'DELETE',
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				};
				getActions().getTransactions();
			},
			setCurrentBudget: (Budget) => { setStore({ Budget: Budget }) },
			getBudgets: async () => {
				const uri = `${getStore().host}/api/budgets`;
				const token = localStorage.getItem("jwt_token");

				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				};

				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error en la respuesta:', response.status, response.statusText);
					return;
				}

				const data = await response.json();
				setStore({ budgets: data.results });
				console.log("estas son los budgets", getStore().budgets)
			},
			createBudget: async (loginData) => {
				const uri = ``;
				const options = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(loginData),
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', error.status, error.statusText);
					return
				}

				getActions().getBudgets();
			},
			editBudget: async (id, dataToSend) => {
				const uri = ``;
				const options = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(dataToSend),
				};
				const response = await fetch(uri, options);
				if (!options.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				getActions().setCurrentBudget({});
				getActions().getBudgets();
			},
			deleteBudgets: async (id) => {
				const uri = ``;
				const options = {
					method: 'DELETE',
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				};
				getActions().getBudget();
			},
			getFixedExpenses: async () => {
				const uri = `${getStore().host}/api/fixed-expenses`;
				const token = localStorage.getItem("jwt_token");

				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				};

				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error en la respuesta:', response.status, response.statusText);
					return;
				}

				const data = await response.json();
				setStore({ fixedExpenses: data.results });
				console.log("estas son los fixed-expenses", getStore().fixedExpenses)
			},
			deleteFixedExpense: async (id) => {
				const uri = ``;
				const options = {
					method: 'DELETE',
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				};
				getActions().getFixedExpenses();
			},
			getBalance: async () => {
				const uri = `${getStore().host}/api/balances`;
				const token = localStorage.getItem("jwt_token");

				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				};

				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error en la respuesta:', response.status, response.statusText);
					return;
				}

				const data = await response.json();
				setStore({ balance: data.results });
				console.log("este es el balance", getStore().balance)
			},
			setCurrentConnections: (connections) => { setStore({ connections: connections }) },
			getConnections: async () => {
				const uri = ``
				const options = {
					method: 'GET',
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				const data = await response.json();
				setStore({ fixedExpenses: data.results });
			},
			getUser: async (id) => {
				try {
					const token = getStore().token || localStorage.getItem("jwt_token");
					const response = await fetch(`${process.env.BACKEND_URL}/api/users/${id}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`,
						},
					});
					if (response.ok) {
						const data = await response.json();
						console.log("Datos de usuario recibidos:", data);
						if (data.results) {
							setStore({ user: data.results });
						} else {
							console.error("Formato de respuesta inesperado:", data);
						}
					} else {
						console.error("Error al obtener los datos del usuario:", response.statusText);
					}
				} catch (error) {
					console.error("Error en la conexión al backend:", error);
				}
			},
			getSources: async () => {
				const uri = `${getStore().host}/api/sources`;
				const token = localStorage.getItem("jwt_token");

				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				};

				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error en la respuesta:', response.status, response.statusText);
					return;
				}

				const data = await response.json();
				setStore({ sources: data.results });
				console.log("estas son los sources", getStore().sources)
			},
			getCategories: async () => {
				const uri = `${getStore().host}/api/categories`;
				const token = localStorage.getItem("jwt_token");

				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				};

				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error en la respuesta:', response.status, response.statusText);
					return;
				}

				const data = await response.json();
				setStore({ categories: data.results });
				console.log("estas son los categories", getStore().categories)
			},
			deleteConection: async (id) => {
				const uri = ``;
				const options = {
					method: 'DELETE',
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				};
				getActions().getConnections();
				setStore({ connections: data.results });
			},
			updateUser: async (id, userData) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/users/${id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						},
						body: JSON.stringify(userData)
					});
					if (!response.ok) {
						const errorResponse = await response.json();
						throw new Error(errorResponse.message || 'Error en la actualización');
					}
					return true;
				} catch (error) {
					console.error('Error updating user:', error);
					return false;
				}


			},
			logout: () => {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				setStore({ token: '', user: {}, isLogged: false });
			}
		}
	}
};

export default getState;
