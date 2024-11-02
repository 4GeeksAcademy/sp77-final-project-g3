const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: '',
			message: null,
			host: ``,
			email: '',
			isLogged: true,
			transactions: [],
			budgets: [],
			balance: [],
			connections: [],
			fixed_Expenses: [],
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
				console.log(data);
			
				localStorage.setItem('token', data.access_token);
				localStorage.setItem('user', JSON.stringify(data.results));
				setStore({ isLogged: true, user: data.results });
			},			
			exampleFunction: () => {getActions().changeColor(0, "green");},
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
			changeColor: (index, color) => {
				const store = getStore();  // Get the store
				const demo = store.demo.map((element, i) => {
					if (i === index) element.background = color;
					return element;
				});
				setStore({ demo: demo });  // Reset the global store
			},
			// actions for ExpenseVue
			is_Logged: async () => {
				const uri = ``
				const options =""
			},
			setCurrentUsername: (username) => { 
				setStore({ username: username }) 
			},
			SaveUsername: (username) => {
				const storedUsername = localStorage.getItem('username');
				if (storedUsername) {
					try {
						const localUsername = localStorage.getItem('username')
						setStore({ username: localUsername })
					} catch (error) {
						console.error('Error al analizar el nombre de usuario almacenado:', error);
						setStore({ username: '' });
					}
					return
				}
				setStore({ username: username })
				localStorage.setItem('username', JSON.stringify(username))
			},
			clearUsername: () => {
				setStore({ username: '' });
				localStorage.removeItem('username');
			},
			getEmail: (email) => { 
				setStore({ email: email }) 
			},
			saveEmail: (email) => {
				const storedUsername = localStorage.getItem('email');
				if (storedUsername) {
					try {
						const localUsername = localStorage.getItem('email')
						setStore({ email: localUsername })
					} catch (error) {
						console.error('Error al analizar el email del usuario almacenado:', error);
						setStore({ email: '' });
					}
					return
				}
				setStore({ emaile: username })
				localStorage.setItem('email', JSON.stringify(email))
			},
			clearEmail: () => {
				setStore({ email: '' });
				localStorage.removeItem('email');
			},
			editUsername: async (id, dataToSend) => {
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
				getActions().setCurrentUsername({});
				getActions().getUsername();
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
				getActions().getUsername();
			},
			setCurrentTransaction: (transaction) => { setStore({ transactions: transaction}) },
			getTransactions: async () => {
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
				setStore({ transactions: data.results });
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
			setCurrentBudget: (Budget) => { setStore({ Budget: Budget}) },
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
			setCurrentFixedExpenses: (fixed_Expenses) => { setStore({ fixed_Expenses: fixed_Expenses}) },
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
			setCurrentConnections: (connections) => { setStore({ connections: connections}) },
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
			getUser: async () => {
				try {
					const response = await fetch("URL_DEL_BACKEND/user", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							// Agrega autenticación si es necesario
							"Authorization": `Bearer ${store.token}`,
						},
					});
					if (response.ok) {
						const data = await response.json();
						setStore({ user: data });
					} else {
						console.error("Error al obtener los datos del usuario:", response.statusText);
					}
				} catch (error) {
					console.error("Error en la conexión al backend:", error);
				}
			}
		}
	};
};

export default getState;

