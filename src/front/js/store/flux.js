const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: '',
			demo: [{title: "FIRST", background: "white", initial: "white"},
				     {title: "SECOND", background: "white", initial: "white"}],
			message: null,
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
				}
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error', response.status, response.statusText);
					return;
				}
				const data = await response.json()
				console.log(data)
				localStorage.setItem('token', data.access_token)
				localStorage.setItem('user', JSON.stringify(data.results))
				setStore({ isLoged: true, user: data.results.email })
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
			}
		}
	};
};

export default getState;
