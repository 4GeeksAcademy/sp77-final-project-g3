const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			host: `https://organic-potato-jjrrj747gq993j799-3001.app.github.dev/`,
			user: '',
			email: '',
			isLogged: true,
			transactions: [],
			budgets: [],
			balance: [],
			connections: [],
			fixed_Expenses: [],
			token: ''
		},

		actions: {
			getToken: () => {
				let token = getStore().token;  // Intenta obtener el token del store
				if (!token) {
					// Si no está en el store, intenta obtenerlo del localStorage
					token = localStorage.getItem("jwt_token");
					if (token) {
						// Si se encuentra en localStorage, guárdalo en el store para reutilización
						setStore({ token });
					}
				}
				return token;
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
			setCurrentTransaction: (transaction) => { setStore({ transactions: transaction }) },
			getTransactions: async () => {
				const uri = `${getStore().host}/transactions`;
				const token = localStorage.getItem("jwt_token");

				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				};

				try {
					const response = await fetch(uri, options);

					if (!response.ok) {
						console.log('Error:', response.status, response.statusText);
						return;
					}

					const data = await response.json();
					console.log('Data:', data);  // Opcional: para verificar la data en consola

					// Suponiendo que `data.results` contiene las transacciones
					setStore({ transactions: data.results });
				} catch (error) {
					console.error("Fetch error:", error);
				}
			},
			createTransaction: async (loginData) => {
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

				getActions().getTransactions();
			},
			editTransaction: async (id, dataToSend) => {
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
				getActions().setCurrentTransactions({});
				getActions().getTransactions();
			},
			deleteTransaction: async (id) => {
				const uri = ``;
				const options = {
					method: 'DELETE',
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				};
				getActions().getTransaction();
			},
			setCurrentBudget: (Budget) => { setStore({ Budget: Budget }) },
			getBudget: async () => {
				const uri = ``
				// console.log('URI:', uri);
				const options = {
					method: 'GET',
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				const data = await response.json();
				// console.log('este es el data:', data);
				setStore({ Budget: data.results });
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
			setCurrentFixedExpenses: (fixed_Expenses) => { setStore({ fixed_Expenses: fixed_Expenses }) },
			getFixedExpenses: async () => {
				const uri = ``
				// console.log('URI:', uri);
				const options = {
					method: 'GET',
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				const data = await response.json();
				// console.log('este es el data:', data);
				setStore({ Budget: data.results });
			},
			deleteFixedExpnese: async (id) => {
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
				const uri = ``
				// console.log('URI:', uri);
				const options = {
					method: 'GET',
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				const data = await response.json();
				// console.log('este es el data:', data);
				setStore({ Balance: data.results });
			},
			setCurrentConnections: (connections) => { setStore({ connections: connections }) },
			getFixedExpenses: async () => {
				const uri = ``
				// console.log('URI:', uri);
				const options = {
					method: 'GET',
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error:', response.status, response.statusText);
					return
				}
				const data = await response.json();
				// console.log('este es el data:', data);
				setStore({ fixedExpenses: data.results });
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
			// comentario 
		}
	};
};

export default getState;
