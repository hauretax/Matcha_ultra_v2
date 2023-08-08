const profile = {
	username: "tonio",
	email: "tonio@gmail.com",
	lastName: "Labalette",
	firstName: "Antoine",
	emailVerified: false,
	gender: "Male",
	birthDate: "3/12/1990",
	orientation: "Heterosexual",
	interests: ["sport", "philosophy", "dev", "techno", "board games"],
	biography: "What's amazing about life is that you are ALL IN. Whether you want it or not. It WILL kill you at the end. So why not live the most amazing life you can ?",
	pictures: [process.env.PUBLIC_URL + "/images/profilePicture.png", null, null, process.env.PUBLIC_URL + "/images/secondaryPicture.jpeg"]
};

const options = ["sport", "philosophy", "dev", "techno", "board games", "vegan", "fun", "pinacolada", "dancing in the rain"];

const fakeApiProvider = {
	getProfile() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ data: profile });
			}, 500);
		});
	},

	getOptions() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ data: options });
			}, 500);
		});
	},

	setInterests(interests: string[]) {
		return new Promise((resolve) => {
			setTimeout(() => {
				profile.interests = interests;
				interests.forEach(interest => {
					if (!options.includes(interest)) options.push(interest);
				});
				resolve({ data: { message: "Interests updated" } });
			}, 500);
		});
	},

	setBiography(biography: string) {
		return new Promise((resolve) => {
			setTimeout(() => {
				profile.biography = biography;
				resolve({ data: { message: "Biography updated" } });
			}, 500);
		});
	},

	setProfile(firstName: string, lastName: string, birthDate: string, gender: string, orientation: string, email: string) {
		return new Promise((resolve) => {
			setTimeout(() => {
				profile.firstName = firstName;
				profile.lastName = lastName;
				profile.birthDate = birthDate;
				profile.gender = gender;
				profile.orientation = orientation;
				profile.email = email;
				resolve({ data: { message: "Profile updated" } });
			}, 500);
		});
	}
};

export default fakeApiProvider;