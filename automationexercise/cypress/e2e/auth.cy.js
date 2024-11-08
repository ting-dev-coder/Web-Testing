describe("User Sign-up and Login", () => {
	let user;
	beforeEach(() => {
		cy.fixture("auth").then((auth) => (user = auth));
		cy.visit("http://automationexercise.com");

		//  Verify that home page is visible successfully
		cy.get("h1").should("be.visible").and("contain", "Automation");
	});
	context("Case1: Register", () => {
		beforeEach(() => {
			cy.contains(" Signup / Login").click();

			cy.contains("h2", "New User Signup!").should("be.visible");
			cy.get('input[data-qa="signup-name"]').as("signupName");
			cy.get('input[data-qa="signup-email"]').as("signupEmail");
			cy.contains("button", "Signup").as("signupBtn");
		});
		it("Register User", () => {
			cy.get("@signupName").type(user.account);
			cy.get("@signupEmail").type(user.email);

			cy.get("@signupBtn").click();

			cy.contains("Enter Account Information").should("be.visible");

			cy.get('input[type="radio"][name="title"][value="Mrs"]').check();

			cy.get('input[type="password"]').type(user.password);

			cy.get("#days").select("5");
			cy.get("#months").select("May");
			cy.get("#years").select("1996");

			cy.get('input[id="newsletter"][type="checkbox"][value="1"]').check();
			cy.get('input[id="optin"][type="checkbox"][value="1"]').check();

			// Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
			cy.get('input[id="first_name"]').type(user.firstName);
			cy.get('input[id="last_name"]').type(user.lastName);
			cy.get('input[id="company"]').type(user.company);
			cy.get('input[id="address1"]').type(user.address);
			cy.get('input[id="address1"]').type(user.address);
			cy.get('select[id="country"]').select(user.country);
			cy.get('input[id="state"]').type(user.state);
			cy.get('input[id="city"]').type(user.city);
			cy.get('input[id="zipcode"]').type(user.zipCode);
			cy.get('input[id="mobile_number"]').type(user.phone);

			cy.contains("button", "Create Account").click();

			cy.contains("Account Created!").should("be.visible");

			cy.contains("Continue").click();

			cy.contains(`Logged in as ${user.account}`).should("be.visible");
		});

		it("Register User with existing email", () => {
			cy.get("@signupName").type(user.account);
			cy.get("@signupEmail").type(user.email);
			cy.get("@signupBtn").click();
			cy.contains("Email Address already exist!").should("be.visible");
		});
	});
	context("Case2: Login/Logout/Delete", () => {
		beforeEach(() => {
			cy.contains("a", "Signup / Login").click();

			cy.contains("h2", "Login to your account").should("be.visible");

			cy.get('input[data-qa="login-email"]').as("login-email");
			cy.get('input[data-qa="login-password').as("login-password");
			cy.contains("button", "Login").as("loginBtn");
		});
		it("Login User with correct email and password", () => {
			cy.get("@login-email").type(user.email);
			cy.get("@login-password").type(user.password);

			cy.get("@loginBtn").click();
			cy.contains(`Logged in as ${user.account}`).should("be.visible");
		});

		it("Login User with incorrect email and password", () => {
			cy.get("@login-email").type("wrong email@gmail.com");
			cy.get("@login-password").type("12345678");

			cy.get("@loginBtn").click();
			cy.contains("Your email or password is incorrect!").should("be.visible");
		});

		it("Logout User", () => {
			cy.get("@login-email").type(user.email);
			cy.get("@login-password").type(user.password);
			cy.get("@loginBtn").click();

			cy.contains("a", "Logout").click();

			cy.url().should("eq", "https://automationexercise.com/login");
		});

		it("Delete User", () => {
			cy.get("@login-email").type(user.email);
			cy.get("@login-password").type(user.password);

			cy.get("@loginBtn").click();
			cy.contains("a", " Delete Account").click();

			cy.contains("Account Deleted!").should("be.visible");

			cy.contains("Continue").click();
		});
	});

	context("Case3: Contact Us Form", () => {
		it("Submit contact us form", () => {
			cy.contains("Contact us").click();
			cy.contains("Get In Touch").should("be.visible");

			cy.get('input[data-qa="name"]').type(user.account);
			cy.get('input[data-qa="email"]').type(user.email);
			cy.get('input[data-qa="subject"]').type("subject");
			cy.get('textarea[data-qa="message"]').type("message");

			cy.get('input[data-qa="submit-button"]').click();

			cy.contains("Success! Your details have been submitted successfully.").should("be.visible");

			cy.contains("a.btn-success", "Home").click();

			cy.url().should("eq", "https://automationexercise.com/");
		});
	});

	context("Case4: Verify Test Cases Page", () => {
		it("User is navigated to test cases page successfully", () => {
			cy.contains("Test Cases").click();

			cy.url().should("eq", "https://automationexercise.com/test_cases");
		});
	});

	context("Case5: Product functionality", () => {
		beforeEach(() => {
			cy.contains("Products").click();

			cy.url().should("eq", "https://automationexercise.com/products");
		});

		it("Verify product detail page", () => {
			cy.get(".features_items").contains("View Product").first().click();

			cy.url().should("match", /https:\/\/automationexercise\.com\/product_details\/\d+/);

			cy.get(".product-information > h2").should("be.visible");

			cy.get(".product-information > :nth-child(3)").should("be.visible");

			cy.get(":nth-child(5) > span").should("be.visible");

			cy.get(".product-information > :nth-child(6)").should("be.visible");

			cy.get(".product-information > :nth-child(7)").should("be.visible");

			cy.get(".product-information > :nth-child(8)").should("be.visible");
		});

		it("Search Product", () => {
			cy.get("#search_product").type("Premium Polo  shirts");
			cy.get("button#submit_search").click();

			cy.contains("Searched Products").should("be.visible");

			cy.get(".product-image-wrapper").its("length").should("eq", 1);
		});
	});
	context("Case6: Subscription functionality", () => {
		it("Verify Subscription in home page", () => {
			cy.get("footer").scrollIntoView();

			cy.get("#footer").within(() => {
				cy.contains("Subscription").should("be.visible");

				cy.get("input#susbscribe_email").type(user.email);

				cy.get("button#subscribe").click();

				cy.contains("You have been successfully subscribed!").should("be.visible");
			});
		});
		it("Verify Subscription in Cart page", () => {
			cy.contains("Cart").click();
			cy.get("footer").scrollIntoView();

			cy.get("#footer").within(() => {
				cy.contains("Subscription").should("be.visible");

				cy.get("input#susbscribe_email").type(user.email);

				cy.get("button#subscribe").click();

				cy.contains("You have been successfully subscribed!").should("be.visible");
			});
		});
	});
	// context("Case7: Cart functionality", ()=> {
	// 	it("Add Products in Cart",()=> {
	// 		cy.contains("Products").click()

	// 	})
	// })
	// context("Case7: Order functionality", ()=> {})
});
