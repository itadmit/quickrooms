Pre-Fill payment page (IFRAME)
You can pass your buyer's details to our payment page, to pre-fill the form. Simply concatenate the optional parameters to the end of the received sale_url. These are the supported fields:

Parameter	Description
first_name	Card holder's first name
last_name	Card holder's last name
phone	Card holder's phone number
email	Card holder's email address
social_id	Card holder's social ID - used for cards issued in Israel
zip_code	Card holder's zip code - used for cards issued in USA, Canada and United Kingdom
Here is an example of a pre-filled payment page:

urlWithParameters = sale_url + "?first_name=First&last_name=Last&phone=0501234567&email=test@example.com

Note 1:
For security reasons, credit card information related fields cannot be pre-filled.

Note 2:
Passed values which will be found invalid, won't be displayed on the form.

Success Redirect (IFRAME)
Once the sale is paid successfully, the buyer will be redirected to the provided sale_return_url, with the sale details as GET parameters.

Example redirect URL: https://www.example.com/payment/success?payme_status=success&payme_signature=75e99dbcb25cdfbe1c62f0b9376f4144&payme_sale_id=XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX&payme_transaction_id=XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX&price=10000&currency=USD&transaction_id=12345&is_token_sale=0

Parameter	Description
payme_status	success Status of the request (success, error)
payme_signature	75e99dbcb25cdfbe1c62f0b9376f4144 MD5 Signature
payme_sale_id	XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX Our unique sale ID
payme_transaction_id	XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX Our unique transaction ID
price	10000 Sale final price. For example, if the price is 50.75 (max 2 decimal points) the value that needs to be sent is 5075
currency	USD Sale currency. 3-letter ISO 4217 name
transaction_id	12345 Merchant's unique sale ID for correlation with us
is_token_sale	0

----

Hosted Fields JSAPI Guide
Client Integration Manual
Basic
jsFiddle
Basic example based on Bootstrap 3

Example 1
JavaScript
CSS
Example 1 RTL
JavaScript
CSS
The same UI/UX example like Example 1 but shows how to tackle RTL languages

Example 2
JavaScript
CSS
Example 3
JavaScript
CSS
Example 4
JavaScript
CSS
Step-by-step integration
Include Client API Library into <head> section of your page Put markup, designed by your own or corporate site template Initialize integration with API key, get Hosted Fields Manager and manage protected fields using simple API

Click here to review our Github library
Include Client API Library
<html lang="en">
    <head>
      ...
    
      <!-- Include Client API Library in your page -->
      <script src="https://cdn.payme.io/hf/v1/hostedfields.js"></script>
      ...
    </head>
    <body>...</body>
</html>
Put your payment form markup
<html lang="en">
    <head>
        <!-- Include Client API Library in your page -->
        ...
    </head>
    <body>
        <!-- PAYMENT FORM STARTS HERE -->
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-4">
            
              <div class="panel panel-default credit-card-box">
                <div class="panel-body">
                  <form role="form" id="checkout-form">
        
                    <div class="row">
                      <div class="col-xs-12 col-md-12">
                        <div class="form-group" id="card-number-group">
                          <label for="card-number-container" class="control-label">CARD NUMBER</label>
                          
                          <!-- Container for Credit Card number field -->
                          <div id="card-number-container" class="form-control input-lg"></div>

                        </div>
                      </div>
                    </div>
        
                    <div class="row">
                      <div class="col-xs-7 col-md-7">
                        <div class="form-group" id="card-expiration-group">
                          <label for="card-expiration-container" class="control-label">EXPIRATION DATE</label>
                          
                          <!-- Container for Credit Card expiration date field -->
                          <div id="card-expiration-container" class="form-control input-lg"></div>
                          
                        </div>
                      </div>
                      <div class="col-xs-5 col-md-5 pull-right">
                        <div class="form-group" id="card-cvv-group">
                          <label for="card-cvv-container" class="control-label">CVV</label>
                          
                          <!-- Container for Credit Card CVV field -->
                          <div id="card-cvv-container" class="form-control input-lg"></div>
                          
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-xs-12">
                      
                        <!-- Form submit button -->
                        <button class="subscribe btn btn-success btn-lg btn-block" id="submit-button" disabled>
                          Pay 55.00 USD
                        </button>
                        
                      </div>
                    </div>
        
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- PAYMENT FORM ENDS HERE -->
   
    </body>
</html>
Initialization and interaction
<html lang="en">
    <head>
        <!-- Include Client API Library into your page -->
        ...
    </head>
    <body>
        <!-- PAYMENT FORM STARTS HERE -->
        ...
        <!-- PAYMENT FORM ENDS HERE -->
        <script>
            
            var apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; // Merchant API key from Settings page in the dashboard
            
            PayMe.create(apiKey, { testMode: true }).then(function (instance) {
           
              var fields = instance.hostedFields();
              
              var cardNumber = fields.create('cardNumber');
              var expiration = fields.create('cardExpiration');
              var cvc = fields.create('cvc');
              
              cardNumber.mount('#card-number-container');
              expiration.mount('#card-expiration-container');
              cvc.mount('#card-cvv-container');
              
              ...
              
            }).catch(function(error) {
                // Instantiation error occurs 
            })
        
        </script>
    </body>
</html>
Let's break down code, presented above. First of all you must get and provide your Merchant API key from Settings page in the dashboard.

...
// This is the Merchant API key (Test API key in this case)
var apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
...
Second, you must obtain integration instance for the merchant

var apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

// There is optional configuration object with testMode: true
// because we are using the API key from the test server
PayMe.create(apiKey, { testMode: true })
    .then(function (instance) {
    
      // Here we can work with successfully initialized
      // integration instance - Integration Manager
       ...
    })
    .catch(function(error) {
      // Here you can handle instantiation error
      ...
    });
    
...
Initialization settings
Property	Default value	Available values	Description
testMode	false	true / false	Test mode - used to control in which environment payment will be processed
language	'en'	'en' / 'he'	Language - controls the language of the messages and text direction (rtl or ltr). en (for English) or he (for Hebrew)
tokenIsPermanent	true	true / false	Token is permanent - Indicates whether it is a one-time-use or multi-use token
Next step - to initialize integration type and get corresponding manager

Hosted fields integration type
This integration type allows you to use secure way to collect user's sensitive data for making payments.

To obtain Hosted Fields manager you must call hostedFields method

PayMe.create(key, { testMode: true })
    .then(function (instance) {
    
      // Getting Hosted Fields Integration manager
      var fields = instance.hostedFields();
    })
    .catch(function(error) {
        ...
    });
As soon as you have Hosted Fields Manager you are ready to create actual protected fields. You can create as many fields as you need but you can create each field type only once. It means if cardNumber field was created you can't create more cardNumber fields, but you can create payerEmail and other (for details see Tokenization section).

For example let's create 3 most important fields:

PayMe.create(key, { testMode: true })
    .then(function (instance) {
    
      
      var fields = instance.hostedFields();
      
      // Hosted fields creation
      var cardNumber = fields.create('cardNumber');
      var expiration = fields.create('cardExpiration');
      var cvc = fields.create('cvc');
    })
    .catch(function(error) {
        ...
    });
...
Hint - We propose to create field names within Payme.fields object

// Instead of this
 var cardNumber = fields.create('cardNumber');
 // try to use this
 var cardNumber = fields.create(PayMe.fields.NUMBER);
Having created all of necessary fields, they must be mounted to the chosen page place. Fields will be shown on your page only after mounting

PayMe.create(key, { testMode: true })
    .then(function (instance) {
    
      
      var fields = instance.hostedFields();
      
      var cardNumber = fields.create('cardNumber');
      var expiration = fields.create('cardExpiration');
      var cvc = fields.create('cvc');
      
      // Mount credit card inside container with id="card-number-container"
      cardNumber.mount('#card-number-container');
      ...
    })
    .catch(function(error) {
        ...
    });
...
Hint - Field instance mount method accepts any valid query selector

// Select by id
cardNumber.mount('#card-number-container');

// Select by class
cardNumber.mount('.credit-card-wrapper');

// Select by attribute
cardNumber.mount('[data-role="credit-card-input"]');
Hint - We can be notified on result by promise, because field mounting is an asynchronous process

...
// Mount credit card inside container with id="card-number-container"
cardNumber.mount('#card-number-container').then(function() {
    // Field was mounted successfully
}).catch(function(error){
    // There is error handling code
});
...
Field Creation Options
.create(field, options) method accepts an optional second argument options which is helpful in case you want to customize the field created with it.

var cardNumberFieldOptions = {
    placeholder: 'Enter your Credit Card Number',
    messages: {
        required: 'The Credit Card Number is Required!',
        invalid: 'Bad Credit Card Number'
    },
    styles: ... // see below
};
var cardNumber = fields.create('cardNumber', cardNumberFieldOptions);
The available properties for customization:

Property	Description
placeholder	Placeholder text for empty field
messages	Validation messages object, can have required and invalid properties (see Field Event Object and Examples page)
styles	CSS properties for "protected" fields (see Field Styling)
Field Styling
Because the "protected" fields are protected, you can use only limited CSS properties and selectors:

Whitelisted CSS properties:

color
font-size
text-align
letter-spacing
text-decoration
text-shadow
text-transform
Whitelisted CSS rules:

::placeholder

Allowed properties and selectors are organized into three groups within field creation configuration options.

var cardNumberFieldOptions = {
	placeholder: 'Enter your Credit Card Number',

	// ...
	
	styles: {
	  base: {
		'color': '#000000',
		'::placeholder': {
			color: '#F2F2F2'
		}
	  },
	  invalid: {
		'color': 'red'
	  },
	  valid: {
		'color': 'green'
	  }
	}
};
Each group represents the state of the protected field like a CSS class. For example:

/* base styles would be applied as a default style */
input.credit-card .base {
	color: #000000;
	font-size: 16px;
	text-align: center;
	letter-spacing: .25em;
	text-decoration: underline;
	text-shadow: 1px 1px 2px black, 0 0 1em red;
	text-transform: uppercase;
}

input.credit-card ::placeholder {
	color: gray;
}

/* .invalid styles would be applied on top of the .base when field validation fails */
input.credit-card .base .invalid {
	color: red;
}

/* .valid styles would be applied on top of the .base when the field became valid */
input.credit-card .base .valid {
	color: green;
}
Note - This information is related only to "protected" fields, which were created with Hosted Fields Integration manager via .create(...) and .mount(...) call. In case you are going to use your own markup/widget/etc. for any additional fields (first name, last name, email, phone number, social ID) then you are free to use any CSS code to style them.

Hosted fields integration interaction
Right after field creation you can use field instance to listen basic set of events to interact with code on your page.

For example, let's listen keyup event on credit card field:

PayMe.create(key, { testMode: true })
    .then(function (instance) {
    
      
      var fields = instance.hostedFields();
      
      var cardNumber = fields.create('cardNumber');
      ...
      
      cardNumber.on('keyup', function(event) {
        console.log(event);
      })
      
      // Mount credit card inside container with id="card-number-container"
      cardNumber.mount('#card-number-container');
      ...
    })
    .catch(function(error) {
        ...
    });
...
and each time when keyup event occurs on cardNumber field you will be notified. Keep in mind, for security reasons event object was significantly simplified (see Field Event Object)

Field events
Using field events your can build you own logic. There is available limited set of events out of the box, those caused by security reasons

Event type	Fields	Description
change	all	works like standard change
blur	all	works like standard blur
focus	all	works like standard focus
keyup	all	works like standard keyup
keydown	all	works like standard keydown
keypress	all	works like standard keypress
validity-changed	all	emits when field validity state changed. Can be used for showing error messages
card-type-changed	cardNumber	emits when library detects vendor of entered Credit Card number
Field Event Object
Shape of change, blur, focus, keyup, keydown, keypress, validity-changed are the same among all the fields and can be either valid or not

json
js
// Valid field
{
    type: "focus",       
    event: "focus",      // event type
    field: "cardNumber", // field which emits this event 
    isValid: false       // field validity status
}
Shape of card-type-changed is little bit different and it can be used for displaying credit card brand icon

js
js
// Valid field
{
    type: "card-type-changed"
    event: "card-type-changed"
    field: "cardNumber"
    
    isValid: true,
    
    cardType: "visa"          // Card vendor 
}
here cardType property can be founded. All available types are listed below

cardType value	Brand	Mask
unknown	Unknown brand	
amex	American Express: starts with 34/37	34♦♦ ♦♦♦♦♦♦ ♦♦♦♦
diners	Diners Club: starts with 300-305/309...	300♦ ♦♦♦♦♦♦ ♦♦♦♦
jcb	JCB: starts with 35/2131/1800	35♦♦ ♦♦♦♦ ♦♦♦♦ ♦♦♦♦
visa	VISA: starts with 4	4♦♦♦ ♦♦♦♦ ♦♦♦♦ ♦♦♦♦
mastercard	MasterCard: starts with 51-55/22-27	51♦♦ ♦♦♦♦ ♦♦♦♦ ♦♦♦♦
discover	Discover: starts with 6011/65/644-649	6011 ♦♦♦♦ ♦♦♦♦ ♦♦♦♦
So far so good, now you have form with some fields and you are ready to tokenize sensitive data to create actual sale

Tokenization
Tokenization Is a process of storing sensitive data in the protected vault and providing safe data for you, to make actual payment

To kick off tokenization you must call tokenize(...) method on Ingeration Manager instance

PayMe.create(key, { testMode: true })
  .then(function (instance) {

    var fields = instance.hostedFields();
    ...
    
    // Data for tokenization
    
    var saleData = {

      payerFirstName: 'Foo',
      payerLastName: 'Bar',
      payerEmail: 'foo-bar@domain.com',
      payerPhone: '1231231',
      payerSocialId: '12345',
      payerZipCode: '123456',

      total: {
        label: 'Order #123123',
        amount: {
          currency: 'USD',
          value: '55.00',
        }
      }
    };
    
    // Call for tokenization
    
    instance.tokenize(saleData)
      .then(function (tokenizationResult) {     
              
        // Successfull tokenization
        // 
        // Now you can send 'tokenizationResult' to
        // your server and call `generate-sale` on Core API
        
        console.log(tokenizationResult);
      })
      .catch(function(tokenizationError) {
      
        // Failed tokenization
        // 
        // you can explore 'tokenizationError' object and show error message on your taste
        
        console.error(tokenizationError)
      });
  })

  ...
...
If you want let your users input additional data (First name, Last name, Email, Phone number, Social ID) rather provide by yourself you can use native HTML inputs within your page (please check our examples page). This approach let you to use any presenting, styling, formatting logic. To help you with validation we were exposing validators to you

Additional fields validators
Particular validator can be obtained and used by this code

// ...

var firstNameValidator = PayMe.validators[PayMe.fields.NAME_FIRST];
var validation = firstNameValidator.test('John');

// ...

console.log(validation);
Additional fields validation result
If validation result is success then validation would be null in the other case:

{required: true} - if firstNameValidator.test(...) argument not defined
{invalid: true} - if firstNameValidator.test(...) argument has unallowable value
Note
Values within additional fields must pass exposed validators. Without fulfilling this condition tokenization will fail!

tokenizationResult Structure (successful tokenization)

{
  // Safe Credit Card data
  card: {                                         
    cardMask: "411111******1111",
    cardholderName: "Firstname Lastname",
    expiry: "1119"
  },
  
  // Service data
  type: "tokenize-success",
  testMode: true,                              
  token: "BUYER154-0987247Y-MLJ10OI7-LXRDNDYP", // Payment token for generating payment
  
  // Payer data
  payerEmail: "firstname-lastname@domain.com",
  payerName: "Firstname Lastname",
  payerPhone: "1231231",
  payerSocialId: "111123",
  
  // Payment data
  total: {
    label: "🚀 Rubber duck",
    amount: {
      currency: "USD",
      value: "55.00"
    }
  }
}
tokenizationError structure (tokenization failed)

{
  // Says that the form contains invalid values
  validationError: true
  
  // Here you can find error messages for particular field
  errors: {
    payerEmail: "Mandatory field",
    payerPhone: "Mandatory field"
  },
  
  type: "tokenize-error",
}
Also, you can receive such shape (may be changed in the future)

{

  // This error means that tokenization has already
  // performed for this Intergation Instance
  error: "Bad session",
  message: "Session expired or deleted",
  
  statusCode: 400,
  type: "tokenize-error",
}
Tokenization and Mounted fields
As was mentioned above you can create as many different fields as you need but sometimes you have some user's data, supposed to be filled and you don't want bother your users requested filling their data again. You can do that, just provide it within Data for tokenization object.

For example if you already have email or First + Last Name and you want provide it directly, you can to it

PayMe.create(key, { testMode: true })
  .then(function (instance) {
    
    var fields = instance.hostedFields();
    
    // Create and Mount credit card field
      var cardNumber = fields.create('cardNumber');
      cardNumber.mount('#card-number-container');
      ...
    // Create and Mount credit card expiration field
      ...
    // Create and Mount CVV field
      ...
    // Create and Mount Social Id field
      ...
    // Create and Mount Phone number field
      ...
    
    // Provide all available data
    var saleData = {

      payerFirstName: 'Foo',            // First name field wasn't created, we must provide value
      payerLastName: 'Bar',             // Last name field wasn't created, we must provide value
      payerEmail: 'foo-bar@domain.com', // Email field wasn't created, we must provide value
      
      // payerPhone: '1231231',         // value isn't needed due created Phone number field
      // payerSocialId: '12345',        // value isn't needed due created Social Id field
      // payerZipCode: '123456',        // value isn't needed due created Zip Code field

      total: {
        label: 'Order #123123',
        amount: {
          currency: 'USD',
          value: '55.00',
        }
      }
    };
    
    // Call for tokenization
    
    instance.tokenize(saleData)
      .then(function (tokenizationResult) {     
              
        // Successfull tokenization
        // 
        // Now you can send 'tokenizationResult' to
        // your server and call `generate-sale` on Core API
        
        console.log(tokenizationResult);
      })
      .catch(function(tokenizationError) {
      
        // Failed tokenization
        // 
        // you can explore 'tokenizationError' object and show error message on your taste
        
        console.error(tokenizationError)
      });
  })

  ...
...
Rule of thumb
If you didn't create field - provide corresponding value in tokenization payload, but with one exception. You can't provide values for Credit Card Number, Credit Card Expiration and CVV - corresponding fields must be created and mounted always

What should be done with tokenized data?
You as an embedder may decide by yourself but main idea is send tokenization data to backend and generate sale using Generate sale

Let's say you have such tokenization result and sent it to your backend:

{
  card: {                                         
    cardMask: "411111******1111",
    cardholderName: "Firstname Lastname",
    expiry: "1119"
  },
  
  type: "tokenize-success",
  testMode: true,                              
  token: "BUYER154-0987247Y-MLJ10OI7-LXRDNDYP",
  
  payerEmail: "firstname-lastname@domain.com",
  payerName: "Firstname Lastname",
  payerPhone: "1231231",
  payerSocialId: "111123",
  
  total: {
    label: "🚀 Rubber duck",
    amount: {
      currency: "USD",
      value: "55.00"
    }
  }
}
On the backend side you can start building the generate-sale payload

Generate Sale Attribute	Tokenization Attribute
sale_price	tokenizationData.total.amount.value - must be converted to the integer
product_name	tokenizationData.total.label
currency	tokenizationData.total.amount.currency
buyer_key	tokenizationData.token
and send it to the https://<env>.payme.io/api/generate-sale

Security notes:
Our service has a strict Content Security Policy (CSP) which in some cases might cause error messages to appear in the browser console. These errors do not cause any kind of malfunction or security risk to our service, and you can safely ignore them.

In most cases the errors are caused by third party extensions installed on the browser. Try turning off the extensions or browse in private mode.
The error messages might also be caused by potentially malicious JavaScripts or browser extensions which inject JavaScript to the content pages. Our service is protected against such threats.
Errors examples:

console-errors.png
3DS Integration Using JS API
Step #1 - Setup
This point is identical to what was described in Include Client API Library. You do not need to provide any HTML markup for this interaction if you only use this API to get client information for making payments with 3Ds.

JSFiddle Example

Step #2 - Invoke and Handle hashing result
To obtain client information hash, you as implementer must call the method upon PayMe object and handle Promise resolution.

<html lang="en">
    <head>
      ...
    
      <!-- Include Client API Library in your page -->
      <script src="https://cdn.payme.io/hf/v1/hostedfields.js"></script>
      ...
    </head>
    <body>
      ...
      <!-- Some other code -->
      ...
      
      <script>
        // Obtaining hashed client information
        PayMe.clientData()
          .then((data) => {
            // Use or store hash
            console.log(data.hash);
          })
          .catch((error) => {
            // Handle error
          });
      </script>
      
      ...
      <!-- Some other code -->
      ...
    </body>
</html>
Important Note
PayMe.clientData(isTestMode) can accept boolean argument to indicate that payment doing in test mode

Step #3 - Consume The Encrypted Data
After receiving the hashed client information, the implementer must send this hash to your Back-End server and use it as a parameter for pay-sale (as described below)

Step #4 - Initiate Payment Flow
In order to initiate a payment flow, the implementer must have the following 2 data objects:

Buyer Key
JWT Token
When you have these two parameters, you are good to go in the matters of starting a payment flow

Step #5 - APIs to complete the payment
In order to complete the payment, you’ll need to use 2 API endpoints:

generate-sale

pay-sale

Generate-sale API request to ../api/generate-sale
{
    "seller_payme_id": "MPL16148-77043XMH-T5MOWMZB-DDTAZOPP",
    "sale_price": "1000",
    "currency": "eur",
    "product_name": "Shirt",
    "sale_type": "sale",
    "sale_payment_method": "credit-card",
    "sale_callback_url": "URL"
}
In the case of a challenge, you will receive the 3DS flow result to the callback URL you will provide in the generate-sale request.

Expected Response
{  
    ....
    "payme_sale_id": "SALE1655-3843870J-NTPYLJNW-SOWRLK9X",
    .....
  }
With the sale ID received in the response, you’ll be able to initiate the request to pay-sale:
{
 "seller_payme_id":"MPL15130-83274SO0-SAUCJ4KX-TVEDZCIN",
 "sale_price":"1000",
 "currency":"ILS",
 "installments":"1",
 "language": "en",
 "sale_callback_url": "https://www.example.com/payment/callback",
 "sale_return_url": "https://www.example.com/payment/success",
 "capture_buyer": 0,
 "payme_sale_id": "SALE1654-092102PD-2KRBHZMM-YMP33H7R",
 "buyer_email": "idan@payme.io",
 "buyer_name": "jordan sssssssssssss",
 "buyer_social_id": 311234488,
 "meta_data_jwt":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImN0eSI6Impzb24ifQ.eyJpYXQiOjE2NTUzODQ3NDEsIm5iZiI6MTY1NTM4NDc0MSwiZXhwIjoxNjU1Mzg4MzQxLCJqdGkiOiJlMDBkOTYzMy02ZWExLTRjMTMtOWU4Zi01OTVhYjMyMjU4ZDIiLCJkYXRhIjp7ImlwIjoiMTIzNDUuMTIzNC4zMyIsImFjY2VwdCI6InRleHRcL2h0bWwiLCJqYXZhRW5hYmxlZCI6dHJ1ZSwiamF2YVNjcmlwdEVuYWJsZWQiOnRydWUsImxhbmd1YWdlIjoiaGUtaWwiLCJjb2xvckRlcHRoIjoyLCJzY3JlZW4iOnsiaGVpZ2h0IjoxMi4yLCJ3aWR0aCI6MTIuM30sInRpbWV6b25lIjoiSmVydXNhbGVtIiwidXNlckFnZW50IjoiTW96aWxsYVwvNS4wIChXaW5kb3dzIE5UIDYuMTsgV2luNjQ7IHg2NDsgcnY6NDcuMCkgR2Vja29cLzIwMTAwMTAxIEZpcmVmb3hcLzQ3LjAifX0.WbyU3ejj2PaG9EEPJRxsTqhyB_SuAWgzqJyi6l5l_Fpw3dDpv9obpcPme-7ViGdOTJ97Qn1GKe8wXBU-Y5tZcrLVbwm4w_hGtvCZFC7FNrALTFg1JH7OIFs4ChpvlqegkvWEzjlOp27bU0VuV3gGAiFEhAXffO9W9hgy8px37nUXZtZUbS0zU2b8KcGjmALhUoti8laIkTet4yXLi4fLBcLA0P0BiBuNdS3owdszehsdDwMOQGdtQYTT9C2ZNOMktvKAYdO8xINS__5Rpqz6WB69T8uvdT2ASjx_--0m-XoCKC05dHH_27g0RQ_rpEYnE-vKIeQW70_LHIsL2tLBCg"
}
Response Handling
If the 3DS flow ended in a challenge (URL is received in the next described response), you will get the following response:

{
    "status_code": 5,
    "status_message": "יוצר דף אימות, נא להמתין",
    "redirect_url": "REDIRECT CHALLANGE URL"
}
If the 3DS flow ended in a seamless flow (no challenge required), you will get the following response:

{
    "status_code": 0,
    "payme_status": "success",
    "status_error_code": null,
    "payme_sale_id": "SALE1655-2121212Y-BWFVU1YE-BQ2J6SUW",
    "payme_sale_code": 20511311,
    "sale_created": "2022-06-14 16:08:41",
    "payme_sale_status": "initial",
    "sale_status": "completed",
    "currency": "ILS",
    "transaction_id": "",
    "is_token_sale": false,
    "price": 1000,
    "payme_signature": null,
    "sale_deferred_months": null,
    "status_error_details": null,
    "redirect_url": null,
    "transaction_cc_auth_number": "1172408",
    "payme_transaction_auth_number": "1172408".
    "3ds_sale": true
}
If the 3DS flow ended in a failure, you will get the following response:

{
    "status_code": 1,
    "payme_status": "success",
    "status_error_code": null,
    "payme_sale_id": "SALE1655-2121212Y-BWFVU1YE-BQ2J6SUW",
    "payme_sale_code": 20511311,
    "sale_created": "2022-06-14 16:08:41",
    "payme_sale_status": "failure",
    "sale_status": "failure",
    "currency": "ILS",
    "transaction_id": "",
    "is_token_sale": false,
    "price": 1000,
    "payme_signature": null,
    "sale_deferred_months": null,
    "status_error_details": null,
    "redirect_url": null,
    "transaction_cc_auth_number": "1172408",
    "payme_transaction_auth_number": "1172408".
    "3ds_sale": false
}
Moving to Production
After completing your testing period you will get your production credentials, this means that you should also modify your library to work with our Production Environment.

In order to work with our production environment you should modify the following component:

const isTestMode = false;
Set isTestMode to false will modify the requests to pass through to our production environment. You can go back to testing in any moment by modifying the component to:

const isTestMode = true;


---

Bank Authorization Statuses
Status	Description	Notes
1	Bank authorization opened successfully	
2	Bank authorization failed	
3	Bank authorization canceled by the account owner	Meaning the buyer canceled the authorization in the bank app
5	Authorization moved from previous account	Please notes that the buyer key stays the same
6	Account changed	Please notes that the buyer key stays the same
13	Frozen authorization reactivated	Meaning the buyer froze the authorization in the bank app

---
List of Banks
Bank	Bank Number
בנק יהב	4
בנק הדואר	9
בנק לאומי	10
בנק הפועלים	12
בנק אגוד לישראל	13
בנק אוצר החייל	14
בנק מרכנתיל דיסקונט	17
בנק מזרחי טפחות	20
HSBC	23
UBANK	26
הבין לאומי הראשון	31
בנק ערבי ישראלי	34
בנק אוף אינדיה	39
בנק מסד	46
בנק פאגי	52
בנק ירושלים	54
דקסיה ישראל	68
בנק לאומי למשכנתאות	77
משכן בנהפ למשכנתאות	91
הבין לאומי למשכנתאות	92

---

Document Types
The documents you can generate are:

doc_type code	description	document name
100	Order	order
200	Delivery	delcert
300	Transaction Invoice	deal invoice
305	Invoice	invoice
320	Invoice Receipt	inverc
330	Invoice Refund	refund
400	Receipet	receipt
405	Donation Receipt	trec
600	Offer	offer
-----

File Types
Name	Code	Description
Social Id	1	Social ID document (תעודת הזהות). For additional information see Note 3 above
Bank Account Ownership	2	Proof of bank account ownership or a cancelled cheque photo (שיק מבוטל או אישור ניהול חשבון בנק). For additional information see Note 3 above
Corporate Certificate	3	Incorporation document (תעודת התאגדות של עוסק פטור/עוסק מורשה/חברה בע"מ/עמותה). For additional information see Note 3 above
Bank Authorization	4	Bank authorization (הרשאה לחיוב חשבון)
Personal Guarantee	5	Personal guarantee (ערבות אוואל). Relevant only if was requested by your Account Manager
Promissory Note	6	Promissory note (שטר חוב). Relevant only if was requested by your Account Manager
Processing Agreement	7	Processing agreement (הסכם סליקה). Relevant only if was requested by your Account Manager
Signature	8	Signature (חתימה). Relevant only if was requested by your Account Manager
Stamp	9	Stamp (חותמת). Relevant only if was requested by your Account Manager
Additional License	11	Additional license (רשיון נוסף). Relevant only if was requested by your Account Manager
Public Representative	12	Public representative document (הצהרת איש ציבור). Relevant only if was requested by your Account Manager
Regulatory Authentication	13	Regulatory authentication (נסח חברה או BDI). Relevant only if was requested by your Account Manager
Authorized Signer Protocol	14	Authorized signer protocol (פרוטוקול מורשי חתימה). Relevant only if was requested by your Account Manager
Business Proof	15	Business proof document (אישור עסק). Relevant only if was requested by your Account Manager
Service Receiver	16	Service receiver document (הצהרת מקבל שירות). Relevant only if was requested by your Account Manager
Face-To-Face Approval	17	Face-To-Face approval (אישור זיהוי פנים מול פנים). Relevant only if was requested by your Account Manager
False Statement Of Information	18	False statement of information (הצהרת מידע כוזב). Relevant only if was requested by your Account Manager
Bank Statement	19	Bank Statement of the last 3 months.
Processing History	20	Processing History.
Tax Return	21	Tax Return.
Inventory Proof	22	Inventory Proof.
Company Logo	23	Company logo image. Relevant only if was requested by your Account Manager
Driving License	24	Driving license (רשיון נהיגה). Relevant if you are onboarding Keep sellers.
Social ID Appendix	25	Social ID Appendix (ספח תעודת זהות). Relevant if you are onboarding Keep sellers.
Passport	26	Passport (דרכון). Relevant if you are onboarding Keep sellers.
Origin Tax Confirmation	27	Origin Tax Confirmation (אישור ניכוי מס במקור). Relevant if you are onboarding Keep sellers.
Bookkeeping Certificate	28	Bookkeeping Certificate (אישור ניהול ספרים). Relevant if you are onboarding Keep sellers.
Credit Voucher Discount Agreement	29	Agreement for credit voucher discount.
Professional License	32	An image of a proffesional License
Ministry Certificate	33	An image of a Ministry Certificate.
Copyright	34	An image of a Copyright Certificate.
Lease	35	An image of Lease Agreement of you business.
Social ID Front	90	An image of the front of a Social ID
Social ID Back	91	An image of the back of a Social ID
Passport Front	92	An image of the front side of the passport. (דרכון)
Passport Back	93	An image of the back side of the passport
Driving License Front	94	An image of the front of a driving License (רשיון נהיגה)
Driving License Back	95	An image of the back of a driving License
PayMe	100	
Isracard	101	
Tzameret	102	
Cal	103	
ECom	104	
CardCom	105	
Summary	200	
Site Url	201	

----


Individual Seller Types
Code	Role
1	Owner
2	Signatory
4	Director
8	Executive
16	Back Office

---
Sale Callbacks
Once the sale is paid successfully, we will notify the marketplace with the sale details with a POST of type x-www-form-urlencoded request to the marketplace Callback URL.

Sale Callback Notification Types
Notification	Description
sale-complete	The sale was paid successfully
sale-authorized	The sale was authorized successfully
refund	The sale was refunded
sale-failure	There was an error with the sale
sale-chargeback	The sale was chargebacked
sale-chargeback-refund	The chargeback was reverted
Attribute	Description
status_code	0 Status of the request (0 - success, 1 - error)
status_error_code	In case of an error, our unique error code
status_error_details	In case of an error, the error message
notify_type	sale-complete Sale notification types
sale_created	2016-01-01 15:15:15
transaction_id	12345 Merchant's unique sale ID for correlation with us
payme_sale_id	XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX Our unique sale ID
payme_sale_code	12345678 Our unique sale code (for display purposes only)
payme_transaction_id	XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX Our unique transaction ID
price	1000 Sale final price. For example, if the price is 50.75 (max 2 decimal points) the value that needs to be sent is 5075
currency	USD Sale currency. 3-letter ISO 4217 name
sale_status	completed Sale statuses
payme_transaction_card_brand	Visa
payme_transaction_auth_number	01A2B3C Sale authorization number from the credit company
buyer_card_mask	458045******4580 Buyer's credit card mask
buyer_card_exp	0118 Buyer's credit card expiry date
buyer_name	First Last Buyer's full name
buyer_email	buyer@example.com Buyer's eMail address
buyer_phone	0540000000 Buyer's phone number
buyer_social_id	000000001 Buyer's social id
buyer_key	XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX Buyer key for future token payments. This key is returned only if capture_buyer attribute was set in the request (Using Tokens)
installments	1 Amount of installments for the sale
sale_paid_date	2016-01-01 15:16:15
sale_release_date	2016-01-08 15:15:15
is_token_sale	0 (0 - false, 1 - true)
payme_signature	75e99dbcb25cdfbe1c62f0b9376f4144
sale_invoice_url	https://www.example.com/XXXXXX.pdf Sale invoice URL, if the seller has enabled the invoices

------

Sale Statuses
Sale Type	Sale Status	Description
1	initial	Creation status, a payment was not attempted
2	completed	The sale was paid successfully
3	refunded	The sale was fully refunded
4	partial-refund	The sale was partially refunded
5	authorized	The sale was authorized successfully
6	failed	The sale failed
7	chargeback	The sale was chargedbacked
8	canceled	The sale was canceled
9	voided	The authorization was fully voided
10	partial-void	The authorization was partially voided
11	partial-chargeback	The sale was partially chargedbacked


------
Sale Types
Sale Type number	Sale Type
1	sale (J4)
5	authorize (J5)
2	token
3	saleFromSubscription
4	saleFromTemplate
5	multiCapture
6	customerDeposit
7	credit
10	template
11	saleFromPaymentContract
12	sellerToken


---

Seller Incorporation Type (IL)
Code	Type
1	Individual
2	Sole Proprietorship
3	Incorporated Company
4	Partnership
5	Exempt Company
6	Non Profit
7	Limited Partnership
8	Publicly Traded Company
9	Shared Cooperative
10	Public Benefit Company

----

Subscription Iteration Types
ID	Description
1	Daily
2	Weekly
3	Monthly
4	Annually

------
Subscription Statuses
ID	Description
1	Initial - Not paid yet
2	Active - Paid successfully
3	Paused
4	Failed
5	Cancelled
6	Completed
76	Failed - Pending automatic retry



-------
Transaction Statuses
Transaction Status	Status Description
1	pending
2	validated
3	refunded
4	partial refund
5	failed
6	chargeback
7	chargeback-refund
8	voided
9	partial-void
10	partial-chargeback
11	partial-chargeback-refund


-----

Transaction Types
Transaction Types	Description
1	Sale
2	Setup
10	SubscriptionToken
20	Token
30	CustomerDeposit
40	Authorization, Void
50	Customer Sale
60	Balance


-----


VAS Types
VAS Type	Description
1	Integration
2	Payments
3	Discount
4	Merchandise
5	Invoice
6	Sms
7	CreditMatch
8	Antifraud
9	Insurance
10	Delivery
11	Marketplace
12	Development
13	CreationPlans
14	VaultsExternal
15	AlternativePaymentMethod
16	Loan
17	MIDs
18	MIDSwitcher
19	ReleaseDate
20	Settlements
21	Email
22	Catalog
23	Customers
24	MerchantRules
25	InvoicingService
26	KeepAdditionalService
27	Pos
vc_type	vc_type


-----
Apple Pay
The payment method is limited to be used in the following devices manufactured by Apple:

iOS Devices	Mac OS Devices
Safari browser , on an Apple Pay-enabled iOS device	Safari browser on a Macbook Pro with Touch ID or a Mac model 2012 or later paired to a compatible iOS/Apple Watch with handoff enabled.
In order to be able to accept Apple Pay payments on your website, first contact PayMe Partners partners@payme.io to start integration process. Then you will need to complete the following steps:

Adding the file to your website, under the proper folder (Explained in Step 1).
Signing up your website to Apple Pay via /api/vas-enable request.
Logging in to a Testing iCloud account. (The account credentials will be provided by PayMe)
Use our API to generate a new payment using Apple Pay.
Test your integration (Explained in step 5)
Devices supported for Sandbox Testing
You can use the following devices for testing in sandbox:

iPhone 6 or later
iPad mini 3 or later
iPad Air 2
iPad Pro
Apple Watch
Please note that you can not use Mac device for testing.

Step 1: Domain Verification
The first step in the process of accepting Apple Pay on your webiste will be to register your domains. You will need to register both top-level domains and sub-domains serperately.

Top-level domain example: www.payme.io

Sub-domain example: www.marketplace.payme.io

Hosting the Apple Pay's domain verification file on your server
Host the file at /.well-known/apple-developer-merchantid-domain-association on your domain(s) that will display the Apple Pay button.

Apple Pay can be tested in Production environment only.

File to Host
Create a text file with the following text, then add it to the .well-known folder under the name apple-developer-merchantid-domain-association.
Make sure the folder is public, save the file without .txt ending.

7B227073704964223A2230384641324636393342433744413942333336423031373431303038333532374133413243354339343039354142463539333535363042443944434639333032222C2276657273696F6E223A312C22637265617465644F6E223A313632383030303737393730352C227369676E6174757265223A223330383030363039326138363438383666373064303130373032613038303330383030323031303133313066333030643036303936303836343830313635303330343032303130353030333038303036303932613836343838366637306430313037303130303030613038303330383230336533333038323033383861303033303230313032303230383463333034313439353139643534333633303061303630383261383634386365336430343033303233303761333132653330326330363033353530343033306332353431373037303663363532303431373037303663363936333631373436393666366532303439366537343635363737323631373436393666366532303433343132303264323034373333333132363330323430363033353530343062306331643431373037303663363532303433363537323734363936363639363336313734363936663665323034313735373436383666373236393734373933313133333031313036303335353034306130633061343137303730366336353230343936653633326533313062333030393036303335353034303631333032353535333330316531373064333133393330333533313338333033313333333233353337356131373064333233343330333533313336333033313333333233353337356133303566333132353330323330363033353530343033306331633635363336333264373336643730326436323732366636623635373232643733363936373665356635353433333432643530353234663434333131343330313230363033353530343062306330623639346635333230353337393733373436353664373333313133333031313036303335353034306130633061343137303730366336353230343936653633326533313062333030393036303335353034303631333032353535333330353933303133303630373261383634386365336430323031303630383261383634386365336430333031303730333432303030346332313537376564656264366337623232313866363864643730393061313231386463376230626436663263323833643834363039356439346166346135343131623833343230656438313166333430376538333333316631633534633366376562333232306436626164356434656666343932383938393365376330663133613338323032313133303832303230643330306330363033353531643133303130316666303430323330303033303166303630333535316432333034313833303136383031343233663234396334346639336534656632376536633466363238366333666132626266643265346233303435303630383262303630313035303530373031303130343339333033373330333530363038326230363031303530353037333030313836323936383734373437303361326632663666363337333730326536313730373036633635326536333666366432663666363337333730333033343264363137303730366336353631363936333631333333303332333038323031316430363033353531643230303438323031313433303832303131303330383230313063303630393261383634383836663736333634303530313330383166653330383163333036303832623036303130353035303730323032333038316236306338316233353236353663363936313665363336353230366636653230373436383639373332303633363537323734363936363639363336313734363532303632373932303631366537393230373036313732373437393230363137333733373536643635373332303631363336333635373037343631366536333635323036663636323037343638363532303734363836353665323036313730373036633639363336313632366336353230373337343631366536343631373236343230373436353732366437333230363136653634323036333666366536343639373436393666366537333230366636363230373537333635326332303633363537323734363936363639363336313734363532303730366636633639363337393230363136653634323036333635373237343639363636393633363137343639366636653230373037323631363337343639363336353230373337343631373436353664363536653734373332653330333630363038326230363031303530353037303230313136326136383734373437303361326632663737373737373265363137303730366336353265363336663664326636333635373237343639363636393633363137343635363137353734363836663732363937343739326633303334303630333535316431663034326433303262333032396130323761303235383632333638373437343730336132663266363337323663326536313730373036633635326536333666366432663631373037303663363536313639363336313333326536333732366333303164303630333535316430653034313630343134393435376462366664353734383138363839383937363266376535373835303765373962353832343330306530363033353531643066303130316666303430343033303230373830333030663036303932613836343838366637363336343036316430343032303530303330306130363038326138363438636533643034303330323033343930303330343630323231303062653039353731666537316531653733356235356535616661636234633732666562343435663330313835323232633732353130303262363165626436663535303232313030643138623335306135646436646436656231373436303335623131656232636538376366613365366166366362643833383038393064633832636464616136333330383230326565333038323032373561303033303230313032303230383439366432666266336139386461393733303061303630383261383634386365336430343033303233303637333131623330313930363033353530343033306331323431373037303663363532303532366636663734323034333431323032643230343733333331323633303234303630333535303430623063316434313730373036633635323034333635373237343639363636393633363137343639366636653230343137353734363836663732363937343739333131333330313130363033353530343061306330613431373037303663363532303439366536333265333130623330303930363033353530343036313330323535353333303165313730643331333433303335333033363332333333343336333333303561313730643332333933303335333033363332333333343336333333303561333037613331326533303263303630333535303430333063323534313730373036633635323034313730373036633639363336313734363936663665323034393665373436353637373236313734363936663665323034333431323032643230343733333331323633303234303630333535303430623063316434313730373036633635323034333635373237343639363636393633363137343639366636653230343137353734363836663732363937343739333131333330313130363033353530343061306330613431373037303663363532303439366536333265333130623330303930363033353530343036313330323535353333303539333031333036303732613836343863653364303230313036303832613836343863653364303330313037303334323030303466303137313138343139643736343835643531613565323538313037373665383830613265666465376261653464653038646663346239336531333335366435363635623335616532326430393737363064323234653762626130386664373631376365383863623736626236363730626563386538323938346666353434356133383166373330383166343330343630363038326230363031303530353037303130313034336133303338333033363036303832623036303130353035303733303031383632613638373437343730336132663266366636333733373032653631373037303663363532653633366636643266366636333733373033303334326436313730373036633635373236663666373436333631363733333330316430363033353531643065303431363034313432336632343963343466393365346566323765366334663632383663336661326262666432653462333030663036303335353164313330313031666630343035333030333031303166663330316630363033353531643233303431383330313638303134626262306465613135383333383839616134386139396465626562646562616664616362323461623330333730363033353531643166303433303330326533303263613032616130323838363236363837343734373033613266326636333732366332653631373037303663363532653633366636643266363137303730366336353732366636663734363336313637333332653633373236633330306530363033353531643066303130316666303430343033303230313036333031303036306132613836343838366637363336343036303230653034303230353030333030613036303832613836343863653364303430333032303336373030333036343032333033616366373238333531313639396231383666623335633335366361363262666634313765646439306637353464613238656265663139633831356534326237383966383938663739623539396639386435343130643866396465396332666530323330333232646435343432316230613330353737366335646633333833623930363766643137376332633231366439363466633637323639383231323666353466383761376431623939636239623039383932313631303639393066303939323164303030303331383230313863333038323031383830323031303133303831383633303761333132653330326330363033353530343033306332353431373037303663363532303431373037303663363936333631373436393666366532303439366537343635363737323631373436393666366532303433343132303264323034373333333132363330323430363033353530343062306331643431373037303663363532303433363537323734363936363639363336313734363936663665323034313735373436383666373236393734373933313133333031313036303335353034306130633061343137303730366336353230343936653633326533313062333030393036303335353034303631333032353535333032303834633330343134393531396435343336333030643036303936303836343830313635303330343032303130353030613038313935333031383036303932613836343838366637306430313039303333313062303630393261383634383836663730643031303730313330316330363039326138363438383666373064303130393035333130663137306433323331333033383330333333313334333233363331333935613330326130363039326138363438383666373064303130393334333131643330316233303064303630393630383634383031363530333034303230313035303061313061303630383261383634386365336430343033303233303266303630393261383634383836663730643031303930343331323230343230343532666263656430373962393232386666393763353931643362326432323364633239376139383561376338376235613337393836653438653736626133373330306130363038326138363438636533643034303330323034343733303435303232303165336531373939663330343731633339366166626635316463346637643035333239303139393734326163373836383634353133646462383464343835383030323231303065656463653563356138313661623366666263323664613830623637383064646261313933313538323261393839656330396264306665386136623766326134303030303030303030303030227D
When completing your testing process, you will need to exchange the sandbox file with the production file.

Step 2: Enabling the Apple Pay Payment Method
By using the VAS-Enable API request, you will need to register your websites to PayMe's system.

{
  "payme_client_key": "payme_partner_key",
  "seller_payme_id": "MPLDEMO-MPLDEMO-MPLDEMO-1234567",
  "vas_payme_id": "VASLDEMO-VASLDEMO-VASLDEMO-1234567",
  "vas_data": {
      "websites": [
      "payme.io", "marketplace.payme.io"
      ]
  },
  "language": "en"
}
A successful response will be 200 and includes a payload in the form of:

{
    "status_code": 0,
    "seller_payme_id": "MPLDEMO-MPLDEMO-MPLDEMO-1234567",
    "vas_payme_id": "VASLDEMO-VASLDEMO-VASLDEMO-1234567",
    "vas_description": "Payments Account",
    "vas_type": "AlternativePaymentMethod",
    "vas_api_key": "",
    "vas_is_active": true,
    "vas_payer_type": 2,
    "vas_price_currency": "ILS",
    "vas_price_setup_fixed": 0,
    "vas_price_periodic_fixed": 0,
    "vas_price_periodic_variable": "0.00",
    "vas_price_usage_fixed": 0,
    "vas_price_usage_variable": "0.00",
    "vas_market_fee": null,
    "vas_period": 1,
    "vas_data": {
        "websites": [
            "test5.paymeservice.com"
        ]
    }
}
A failed response will be 500 and includes a payload in the form of:

{
    "status_code": 1,
    "status_error_details": "The service was not activated",
    "status_additional_info": null,
    "status_error_code": 720
}
Step 3: Add Apple iCloud account and Testing Cards
Testing iCloud account will be provided by PayMe.

You can find credit cards for testing purposes here.

Step 4: Add and Present the Apple Pay Button
Before you can start Apple Payment you have to create an Apple Sale, which will be paid by your customer.

Apple sale - You will need to generate a new sale using the API generate-sale method presented in our documentation here and briefly below.

Request

raw
json
POST https://<env>.payme.io/api/generate-sale
Content-Type: application/json
PayMe-Public-Key: 9ec*****-****-****-****-*********881

{
  "seller_payme_id":"MPL14950-********-********-HMWATSBQ",
  "sale_price":"1000",
  "currency":"ILS",
  "product_name": "Test",
  "installments":"1",
  "sale_payment_method": "apple-pay",
  "language": "en"
}
Response

{
    "status_code": 0,
    "sale_url": "https://<env>.payme.io/sale/generate/SALE1645-********-********-F2DUVUQI",
    "payme_sale_id": "SALE1645-********-********-F2DUVUQI",
    "payme_sale_code": 1027305,
    "price": 1000,
    "transaction_id": "",
    "currency": "ILS",
    "sale_payment_method": "apple-pay"
}
After a successful sale creation, please save the payme_sale_id value from the response you receive for future usage.

Add libraries
For security reasons Apple allows to use Apple Pay only with their hosted library. It means you should add it before PayMe integration library.

<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  
  <!-- Add official Apple Pay JS API -->
  <script src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"></script>
  <!-- Add PayMe JS API -->
  <script src="https://cdn.paymeservice.com/hf/v1/hostedfields.js"></script>
  
</head>
<body>
...
</body>
This will allow you to use PayMe global object later

Check if the client's system supports Apple Pay
Rule of thumb

You must check Apple Payment availability for your client!

In order check if a payment thorough Apple Pay is available for your client we provide two helper methods:

PayMe.isApplePayAvailable()
PayMe.isSupportsApplePayVersion()
Also you can check what version of Apple Payment API you are using in PayMe.applePayApiVersion

If the client's environment has no support for Apple Payments, please do not show Apple Pay button (described in the following step).

Integrator must check availability before start
if(PayMe.isApplePayAvailable()){
  console.log('ApplePay available');
} else {
  console.log('ApplePay unavailable');
}

if(PayMe.isSupportsApplePayVersion()) {
  console.log('ApplePay version ' + PayMe.applePayApiVersion + ' supported');
} else {
  console.log('This ApplePay version is not supported');
}
“Fast and Simple”: Pay with Apple button
Please follow the Buttons and Marks article in the Apple official website.

<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <!-- Add official Apple Pay JS API -->
  <script src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"></script>
  <!-- Add PayMe JS API -->
  <script src="https://cdn.paymeservice.com/hf/v1/hostedfields.js"></script>

</head>
<body>
    <!-- Pay with Apple button STARTS HERE -->
    <apple-pay-button
      id="pay-with-apple-pay"
      buttonstyle="black"
      type="buy"
      locale="he-IL"></apple-pay-button>
    <!-- Pay with Apple button ENDS HERE -->

    <!-- My Integration -->
    <script>
      var isApplePayAvailable;
    
      if(PayMe.isApplePayAvailable() && PayMe.isSupportsApplePayVersion()) {
        isApplePayAvailable = true;
      } else {
        isApplePayAvailable = false;
      }
      
      const applePayButton = document.getElementById('pay-with-apple-pay');
      if(!isApplePayAvailable) {
        applePayButton.classList.add('hidden');
      }
    </script>
</body>
Please pay attention on the id and locale attribute. You will need id or class or other CSS selector to tell integration library how to find Pay Button. The locale is a custom attribute, one of many which let you customize Apple Pay Button appearance. If your use case is not meet this type of implementation you can provide any CSS selector (even for non existing DOM element) and follow “Manual”: Initiate Payment manually approach

Initialization
After implementing the certificate file, update PayMe Partners partners@payme.io to verify your domain was approved by apple, and to provide your Merchant API key.

...
// This is the Merchant API key (Test API key in this case)
var apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
...
Second, you must obtain integration instance for the merchant

var apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

// There is optional configuration object with testMode: true
// because we are using the API key from the test server
PayMe.create(apiKey, { testMode: true })
    .then(function (instance) {
    
      // Here we can work with successfully initialized
      // integration instance - Integration Manager
       ...
    })
    .catch(function(error) {
      // Here you can handle instantiation error
      ...
    });
    
...
Initialization settings
Property	Default value	Available values	Description
testMode	false	true / false	Test mode - used to control in which environment payment will be processed
Next step - to initialize integration type and get corresponding manager

Note

Integration Manager instance also can be used for Hosted Fields integration

ApplePay sale
Using initialized integration manager you need to use earlier created Sale to create Apple Sale. Just call .appleSale(...) method and get back AppleSale. We will use it to initiate Payment Flow and be notified on progress.

<html lang="en">
    <head>
        <!-- Include Client API Library into your page -->
        ...
    </head>
    <body>
        <!-- Pay with Apple button STARTS HERE -->
        ...
        <!-- Pay with Apple button ENDS HERE -->

        <!-- My Integration -->
        <script>
            
            var apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; // Merchant API key from Settings page in the dashboard
            
            PayMe.create(apiKey, { testMode: true }).then(function (instance) {
           
              var sale = instance.appleSale({
                
                // Optional. In case you want to debug Apple Sale internal transitions
                debugFn: function (message){
                  console.log(message);
                },
                
                
                merchantId: , // Will be provided by your PayMe integration manager
                saleGuid: <payme_sale_id> // See Prerequisites. Create a Sale
              });
              
              ...
              
            }).catch(function(error) {
                // Instantiation error occurs 
            })
        
        </script>
    </body>
</html>
Allow user to Start payment
Because of security reasons you can't just start Apple Payment flow, only user action (click or tap Apple Pay Button) can trigger this flow. Because of that you must initiate this for your user with .letsRock(...) method with Apple Pay Button selector. Or you should check “Manual”: Initiate Payment manually section for additional options.

<html lang="en">
    <head>
        <!-- Include Client API Library into your page -->
        ...
    </head>
    <body>
        <!-- Pay with Apple button STARTS HERE -->
        ...
        <!-- Pay with Apple button ENDS HERE -->

        <!-- My Integration -->
        <script>
            
            var apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; // Merchant API key from Settings page in the dashboard
            
            PayMe.create(apiKey, { testMode: true }).then(function(instance) {
           
              var saleConfig = {...};
              var sale = instance.appleSale(saleConfig);
              
              sale.letsRock('#pay-with-apple-pay')
                .then(function(){
                  console.log('Sale verified and wait for user action');
                })
                .catch(function(err) {
                  console.error('Apple Pay Initialization error'+ err.message);
                });
              
            }).catch(function(error) {
                // Instantiation error occurs 
            })
        
        </script>
    </body>
</html>
Interaction Facade
Highly likely, you will need to receive information of the status of your payment to build your own user experience, Apple Sale provides this option by defining plain configuration object for .letsRock(...) method.

var config = {
  
  // Required
  payButtonSelector: '#pay-with-apple-pay',
  
  // Optional
  canceled: function(){
    console.log('AppleSale cancelled');
  },
  
  // Optional
  validated: function(err) {
    if(!!err){
      console.error('AppleSale validation error '+err.message);
    } else {
      console.log('AppleSale validated successfully');
    }
  },
  
  // Optional
  paymentCompleted: function (err, sale) {
    if(!!err){
      console.error('AppleSale failed ' + err.message);
    } else {
      console.log('Sale Payed' + JSON.stringify(sale, null, 2));
    }
  },
};
Interaction Facade
Property	Default value	Available values	Description
payButtonSelector	none	any valid CSS selector	Selector to find Apple Pay Button on the page
canceled	() => {}	callback function	This function will be called on Apple Sale cancellation
validated	() => {}	callback function	This function will be called after Apple Sale validated by the user
paymentCompleted	() => {}	callback function	This function will on Apple Sale completion with the result
This facade will allow you to register your callbacks and handle changes in your application.

“Manual”: Initiate Payment manually
Sometimes you will need to use our integration library to solve some tricky edge case and you can not provide Pay Button on your page to be picked by the library. This require to provide alternative way to kick-off Apple payment flow programmatically. We are letting you todo that by calling startPayment() function for the prepared ApplePay sale.

Lets review a technical meaning by adapting example from Allow user to Start payment

<html lang="en">
    <head>
        <!-- Include Client API Library into your page -->
        ...
    </head>
    <body>
        ...
        <!-- My Integration -->
        <script>
            var apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; // Merchant API key from Settings page in the dashboard

            PayMe.create(apiKey, { testMode: true }).then(function(instance) {
           
              var saleConfig = {...};
              var sale = instance.appleSale(saleConfig);
              sale
                // !!! THE CHANGES STARTS HERE !!!
                .letsRock('.i-dont-have-pay-button')
                .then(function(startPaymentFn){
                  // In case you want to query ApplePay button yourself
                  document.getElementById('my-custom-button').addEventListener('click', startPaymentFn);
                  
                  // Or even you want to react on Window message
                  window.addEventListener('message', () => {
                    // Do important preparations and ...
                    startPaymentFn();
                  });
                });
                // !!! THE CHANGES ENDS HERE !!!
    
            });
        </script>
    </body>
</html>
Only user action can initiate Apple Payment flow!

As a reminder we would like to repeat the limitation from Apple:

You can not just start Apple Payment flow with startPayment() function, only user action (click or tap on the DOM node) can trigger this flow.

It means even if you will try to postMessage from iFrame using setTimeout() in hope to catch it on the host page, this case will be detected by Apple and will end up with error "Must create a new ApplePaySession from a user gesture handler" (Creating an Apple Pay Session | Apple Developer Documentation)

As code listing shows, we just defined argument for the letsRock.then(...) callback with name startPaymentFn (you can give it any name). This argument is a synchronous function, you can use it as an event handler for your implementation., like we did in our example.

Step 5: Test your integration
To verify the ingeration works as expected:

Add our test page under your domain. For example: {your domain}/apple-pay-test.html see page below.
Fill merchant.paymeproduction under merchantIdentifier
Enter your apiKey under publickKey
Generate sale as described in step 4 and enter the sale id received
Start interaction - will initiate the payment flow with apple pay
Test Page:test page.png

<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <title>Example Bootstrap implementation</title>

  <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

  <script src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"></script>
  <script src="https://cdn.paymeservice.com/hf/v1/hostedfields.js"></script>
</head>
<body>
<div>&nbsp;</div>
<div class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-8 col-sm-offset-2">
      <div class="panel panel-default credit-card-box">
        <div class="panel-body">
          <form id="init-payment-form">
            <div class="row">
              <div class="col-xs-12">
                <div class="form-group">
                  <label for="merchantIdentifier" class="control-label">merchantIdentifier</label>
                  <input
                    id="merchantIdentifier"
                    class="form-control input-lg"
                    value="merchant.paymeproduction">

                </div>
              </div>
              <div class="col-xs-12">
                <div class="form-group">
                  <label for="publicKey" class="control-label">publicKey</label>
                  <input
                    id="publicKey"
                    class="form-control input-lg"
                    value="e780113a-9ac8-4ece-8c64-66b2b8308cb3">

                </div>
              </div>
              <div class="col-xs-12">
                <div class="form-group">
                  <label for="saleId" class="control-label">saleId</label>
                  <input
                    id="saleId"
                    class="form-control input-lg"
                    value="SALE1737-563287XL-NCQMEHY9-KLO4ZJFJ">

                </div>
              </div>
              <div class="col-xs-12">
                <div class="form-group">
                  <button class="btn" id="start-interaction">Start interaction</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="row hidden" id="applepay-button-wrapper">
    <div class="col-xs-12 col-sm-8 col-sm-offset-2">
      <div class="text-center">
        <div>Pay button below</div>
        <apple-pay-button
          id="pay-with-apple-pay"
          buttonstyle="black" type="buy" locale="he-IL"></apple-pay-button>
      </div>
    </div>
  </div>
</div>

<hr>

<pre id="console-pre"></pre>

<script>
  const consolePre = document.getElementById('console-pre');

  function log(txt) {
    consolePre.innerText += txt + '\n';
  }

  function clear() {
    consolePre.innerText = '----- log cleared -----\n\n';
  }
</script>
<script>
  let _currentSale;
  const PayMe = window.PayMe;

  function startApplePayStuff({merchantIdentifier, publicKey, saleId}) {
    const options = {
      testMode: false,
      language: 'he',
      // Extended
      // tokenIsPermanent: false, // default true
      // buyerIsPrivate: true    // default false,
      // buyerPerformValidation: // default true,
    };

    return PayMe.create(publicKey, options).then((instance) => {
      try {
        const currentSale = instance.appleSale({
          debugFn: log,
          merchantId: merchantIdentifier,
          saleGuid: saleId
        });

        // Config can de String
        const config = {
          // Required
          payButtonSelector: '#pay-with-apple-pay',
          // Optional
          canceled: () => {
            log('\nCancelled\n----------------------------------');
          },
          // Optional
          validated: (err) => {
            if(!!err){
              log('\nValidated error\n'+ err.message +'\n----------------------------------');
              console.error(err);
            } else {
              log('\nValidated\n----------------------------------');
            }
          },
          // Optional
          paymentCompleted: (err, sale) => {
            if(!!err){
              log('\nCompleted error\n'+ err.message +'\n----------------------------------');
              console.error(err);
            } else {
              log('\nCompleted\n'+ JSON.stringify(sale, null, 2) +'\n----------------------------------');
            }
          },
        };

        currentSale.letsRock(config)
          .then(() => {
            log('\nSale initialized\n----------------------------------');
          })
          .catch(err => {
            log('\nsale initialization error\n'+ err.message +'\n----------------------------------');
            console.error(err);
          });

        return currentSale;

      } catch (e) {
        log(e.message);
      }
    });
  }

  const paramsForm = document.getElementById('init-payment-form');
  const applePayButtonWrapper = document.getElementById('applepay-button-wrapper');

  function hideButton() {
    if(!applePayButtonWrapper.classList.contains('hidden')){
      applePayButtonWrapper.classList.add('hidden');
    }
  }

  function displayButton() {
    applePayButtonWrapper.classList.remove('hidden');
  }

  //
  // Integrator must check availability before start
  if(PayMe.isApplePayAvailable()){
    log('ApplePay available');
  } else {
    log('ApplePay unavailable');
  }

  if(PayMe.isSupportsApplePayVersion()) {
    log(`ApplePay version "${PayMe.applePayApiVersion}" supported`);
  } else {
    log('This ApplePay version is not supported');
  }

  paramsForm.addEventListener('submit', event => {
    event.preventDefault();

    clear();

    if(_currentSale) {
      _currentSale.destroy();
      hideButton();
    }

    const merchantIdentifier = document.getElementById('merchantIdentifier');
    const publicKey = document.getElementById('publicKey');
    const saleId = document.getElementById('saleId');

    const values = {
      merchantIdentifier: merchantIdentifier.value,
      publicKey: publicKey.value,
      saleId: saleId.value,
    };

    startApplePayStuff(values)
      .then(appleSale => {
        _currentSale = appleSale;
        displayButton();
      })
      .catch(err => {
        hideButton();
        log(err.message);
      });
  });
</script>


</body>
</html>
Errors and Reasons
Your responsibility is to handle possible errors related to the Apple Pay. We provide a limited list of logical errors to help you easily identify and handle mistakes or show localized descriptions for your users. Below, you will be ale to find detailed information and hints for you to help your end-users.

1. NOT_SUPPORTED_DEVICE (no-supported:apple-pay-not-available-for-device) and NO_APPLE_PAY (no-supported:apple-pay-jsapi-not-available)
A context

Apple Payment can work only in Safari Browsers on Apple Devices.

Before you can offer your clients this payment method, you have to check is it possible to execute Apple Payment on the client device. To do this check we are providing special helper-methods (PayMe.isApplePayAvailable() and PayMe.isSupportsApplePayVersion()). But there is possible situation when you ignored this check and tried to create AppleSale. In case of unsupported environment you will receive this error

Reason

Attempt to create AppleSale on unsupported environment (not an Apple Browser, not an Apple Device)

Possible Solutions

You must use PayMe.isApplePayAvailable() and PayMe.isSupportsApplePayVersion() before Apple Sale creation and fallback to the alternative logic in case of negative result.
2. NOT_SUPPORTED_VERSION (no-supported:apple-pay-version-not-supported)
A context

Our integration library is based on the official Apple Pay JSAPI. The official library offers different integration versions. We use v4 to cover as many devices as possible.

Reason

Attempt to create AppleSale on environment which is not supported by the current version of Apple Payment

Possible Solutions

Unfortunately, we have no solution for this situation (TODO - discuss this);
3. VALIDATION_NO_NETWORKS (validation-error:no-supported-networks)
A context

Each of our merchants has limited set of supported Credit Card Brands aka Networks. These networks will be checked before start of Apple Payment.

Reason

Current merchant has no Networks supported by Apple

Possible Solutions

Please reach our support service to solve this issue.
4. VALIDATION_NO_NETWORKS (validation-error:no-supported-networks)
A context

Each of our merchants has limited set of supported Credit Card Brands aka Networks. These networks will be checked before the Apple Pay flow starts.

Reason

Current merchant has no Networks supported by Apple

Possible Solutions

Please reach our support service to solve this issue.
5. INVALID_CFG_PARAM (validation:unknown-configuration-parameter)
A context

To start Apple Payment Flow you must provide simple config data.

Reason

Invalid configuration provided for letsRock(...) method

Possible Solutions

Please check what was provided as config data
6. INVALID_VALIDATED_CB (validation:invalid-type-for-validated-callback) and INVALID_CANCELLED_CB (validation:invalid-type-for-cancelled-callback) end INVALID_COMPLETED_CB (validation:invalid-type-for-payment-completed-callback)
A context

To let your code know about status of Apple Sale we let you provide callback functions. These functions will be called by the integration on status change.

Reason

Invalid configuration provided for letsRock(...) method

Possible Solutions

Please check what is callback provided as part of config data
7. NOT_A_FUNCTION (validation:argument-is-not-a-function)
A context

According to previous sections you must provide a callback functions if you interested to be notified on Apple Sale state change

Reason

Provided not function but something else as a callback(s)

Possible Solutions

Please check what provided as part of config data
Error messages localization
To keep the integration in place, we are not providing any translation possibilities in favor of mnemonic messages. It means our error messages will look to user too technical. To make them human-readable you have to transform it to messages you want

var translatedMessages = {
  'not-found:apple-pay-button-not-found': 'Unable to find Pay button on your page',
  'no-supported:apple-pay-not-available-for-device': 'This device does not support Apple Pay',
  'no-supported:apple-pay-jsapi-not-available': 'This device does not support Apple Pay',
  'no-supported:apple-pay-version-not-supported': 'This device does not support current Apple Pay API version',
  // Other errors ...
};

// Other code...

// Run Apple Payment
sale.letsRock(config).catch(function (err) {
  // Getting translated human-readable error message
  const hriMessage = translatedMessages[err.message];
  alert(hriMessage);
});

// Other code...
For your convenience, we gathered all of the possible error-messages in to the Hash inside PayMe global object, it means instead of doing the following:

var translatedMessages = {
  'not-found:apple-pay-button-not-found': 'Unable to find Pay button on your page',
  'no-supported:apple-pay-not-available-for-device': 'This device does not support Apple Pay',
  'no-supported:apple-pay-jsapi-not-available': 'This device does not support Apple Pay',
  'no-supported:apple-pay-version-not-supported': 'This device does not support current Apple Pay API version',
  // Other errors ...
};
A better option would be to do the following:

// Doing shortcut, for convenience
var messages = PayMe.ERR_MESSAGES;

// Defining hri messages
var translatedMessages = {
  // Errors related to the client environment
  [messages.NO_PAY_BUTTON]: 'Unable to find Pay button on your page',
  [messages.NOT_SUPPORTED_DEVICE]: 'This device does not support Apple Pay',
  [messages.NO_APPLE_PAY]: 'This device does not support Apple Pay',
  [messages.NOT_SUPPORTED_VERSION]: 'This device does not support current Apple Pay API version',

  // Technical errors (ideally should not occur on production)
  [messages.VALIDATION_NO_NETWORKS]: 'There are no supported Credit Card networks for this seller',
  [messages.INVALID_VALIDATED_CB]: 'There is incorrect sale Validatied callback provided by the implementer',
  [messages.INVALID_CANCELLED_CB]: 'There is incorrect sale Cancelled callback provided by the implementer',
  [messages.INVALID_COMPLETED_CB]: 'There is incorrect sale Completed callback provided by the implementer',
  [messages.INVALID_CFG_PARAM]: 'Implementer provided invaid configuration paramener',
  [messages.NOT_A_FUNCTION]: 'This is not a function!'
};
Apple Pay Impelementation using iFrame
If you are willing to implement the apple pay button using an iframe, please get in touch with our integration team for further information.


------
Capture Sale (Authorization)
Also known as “Pre-Authorization”. The requested amount gets reserved (blocked) on the credit card of the buyer for up to 168 hours. A following Capture request will trigger the actual settlement of the funds. Please note that attempting to Capture after the allowed period of time (168 hours) will result in an error.

Importante Notes
Authorization can be fully executed or partially executed only once.
In order to authorize a payment, the sale should be generated with the sale_type="authorize" parameter, and the returned IFRAME displayed to the buyer for credit card information filling.
Attribute	Description
sale_type	= authorize, creates a new sale as authorization.
The authorization is reserved for up to 168 hours
payme_sale_id	XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX Our unique sale ID
sale_price	10000 Capturing sale final price. It can be lower or equal to the original price. For example, if the price is 50.75 (max 2 decimal points) the value that needs to be sent is 5075
installments	1 (required, number) - Amount of installments for the sale.
Process Flow
Create a sale with generate-sale according to the special attributes in the table above.
Once the sale is created, you will get a sale_url for the payment page and a unique payme_sale_code.
After the buyer insert the payment details and pay for the sale, you will receive a callback to the dedicated callback URL you entered in the generate-sale request.
To execute the sale, use the capture-sale request, with the amount you charge.
If you want to cancele the authorization, you need to void the sale using refund-sale.

----

Sandbox and Production URLs
In order to work with the API, you should use the service URLs according to the required environments, Staging or Production.When interacting with the API, make sure you point to the correct environment, with the correct credentials. Both URLs will be stated next to each function.

ENVIRONMENT	URL
Staging	https://sandbox.payme.io/api/
Production	https://live.payme.io/api/

------
Test Cards and Payment Methods
Please use the following credit card when integrating only in the Staging environment.

Main credit card numbers for testing
EMV supported credit cards:

Credit Card	Details
Card Number: 4557430402053431 Expiration: 12/30 CVV:200 Social ID:008336174	Limitations: Acts as an international non-Israeli card. Accepts sales with only one installment. Accepts sales in ILS, USD, EUR.
Card Number: 375516193000090 Expiration: 12/30 CVV: 0957 Social ID:008336174	Limitations: Acts as an international Israeli card. Accepts sales with multiple installments. Accepts sales in ILS, USD, EUR.
Card Number: 5326105300985846 Expiration: 12/30 CVV: 658 Social ID:008336174	Limitations: Acts as a local Israeli card. Accepts sales with multiple installments. Accepts sales in ILS only.
Secondary credit card numbers for testing
Credit Card Type	Credit Card Number
Visa	4111111111111111 4200000000000000
Mastercard	5555555555554444 5454545454545454
AmericanExpress	378282246310005 377777777777770
Diners	38520000023237
Discover	6011000990139424
JCB	3530111333300000
Isracard	12312312
Credit card numbers for testing specific responses and errors
Card Number	Description
4000000000000002	Payment is declined with a card declined error
4000000000000051	Payment is declined with a card blocked error
4000000000000085	Payment is declined with a card stolen error
4000000000000069	Payment is declined with a card expired error
4000000000000101	Payment is declined with a required CVV error
4000000000000127	Payment is declined with an incorrect CVV
4000000000000135	Payment is declined with a credit limit reached error
4242424242424241	Payment is declined with an incorrect card number error
Apple Pay Testing Information
Card Brand	Card Number	Card Expiry Date	Card CVV
Visa	4051 0693 0220 0121	12/27	340
Mastercard	5204 2452 5052 2095	12/30	111
American Express	37272 79248 51007	12/28	1111
Discvoer	FPAN: 6011 0009 9475 4889	12/30	111
Israeli Direct Debit Testing Information
Bank Account Infromation (Bank, Branch, Account Number)	Description
54, 112, 2222111	Bank Authorization is approved after 60 seconds
54, 113, 4444333	Bank Authorization is declined after 60 seconds
SEPA Payment Method Testing Information
Account Number	Description
DE89370400440532013000	The Payment status transitions from initial to completed immidiately.
DE08370400440532013003	The Payment status transitions from initial to completed after 3 minutes.
DE62370400440532013001	The Payment status transitions from initial to failed immidiately.
DE78370400440532013004	The Payment status transitions from initial to failed after 3 minutes.
DE35370400440532013002	The Payment status transitions from initial to completed and then immidiately to chargeback.
BACS Payment Method Testing Information
SORT CODE	Account Number	Description
108800	00012345	The Payment status transitions from initial to completed immidiately.
108800	90012345	The Payment status transitions from initial to completed after 3 minutes.
108800	33333335	The Payment status transitions from initial to completed and than immidiately changed to Failed.


--------


Direct API
Export
v1.2
Our Direct API allows partners who are PCI Compliant (PCI-DSS level 1) and can handle credit card/debit card information to send direct commands via API to capture payments, whether it is a new card using the pay-sale command or a token using capture-buyer-token command.

You can find more information in the following guide - Direct API - How to create and pay sale.

If you have further questions, please reach out to our Customer support team.

Pay Sale
post
https://sandbox.payme.io/api/pay-sale
Overview
This endpoint can be used only if you are using our Direct Integration method.

This endpoint allows you to pay on a sale you created.
By sending this request, a few actions occur: the sale is processed, the buyer is charged, and you receive an asynchronous response with the sale data.

You can find more information in the following guide - Direct API - How to create and pay sale.

Request
Body

application/json

application/json
seller_payme_id
string
required
Our unique seller ID

Example:
abc123_vvds1234
sale_price
string
required
Sale final price. For example, if the price is 50.75 (max 2 decimal points) the value that needs to be sent is 5075. Note that the minimum value is 500.

Example:
140
currency
string
required
Sale currency. 3-letter ISO 4217 name.

Example:
USD
installments
string
required
Amount of installments for the sale.

Example:
12
language
string
The language of the response and callback.

Example:
he
sale_callback_url
string
Callback response to your page regarding call to our API. Default value is taken from the Merchant's settings. Note that you may not send a "localhost" URL as value

Example:
https://www.example.com/payment/callback
sale_return_url
string
required
Once the payment was completed successfully, the user will be redirected to this URL

Example:
https://www.example.com/payment/callback
capture_buyer
number
Flag for requesting the buyer's token for this payment (0 - do not capture token, 1 - capture token). For additional information see Tokens explanation below

Example:
0
buyer_key
string
required
Buyer key for an instant-payment with the token. This key is received through the use of capture_buyer. Note that this attribute cannot co-exist with the capture_buyer parameter in the same request

Example:
BUYER168-XXXXXXXX-XXXXXXXX-WQIWVVLB
payme_sale_id
string
required
Our unique sale ID

Example:
SALE1687-XXXXXXXX-XXXXXXXX-XXXXXXXX
credit_card_number
number
required
The card the transaction will be paid with.

Example:
411111******1111
credit_card_exp
string
required
The expiration date of the card used to pay for the transaction (MM/YY)

Example:
10/25
credit_card_cvv
string
required
The CVV of the card used to pay for the transaction. (3/4 digit code)

Example:
100
Responses
200
500
OK

Body

application/json

application/json
responses
/
200
/
sale_paid_date
status_code
number
Status of the capture request (0 - success, 1 - error)

Example:
0
payme_status
string
PayMe's payment status (success/failure)

Example:
success
payme_sale_id
string
PayMe's unique Sale ID

Example:
SALE1635-XXXXXXXX-XXXXXXXX-O0POYBAJ
payme_sale_code
number
PayMe's unique Sale code

Example:
809283
sale_created
string
The date the sale was created (timestamp)

Example:
2021-11-02 16:36:13
payme_sale_status
string
PayMe's sale status

Example:
completed
sale_status
string
Sale status

Example:
completed
currency
string
Sale currency. 3-letter ISO 4217 name

Example:
USD
transaction_id
string
Transaction ID

Example:
12345
is_token_sale
boolean
Was the card tokenized or not

price
number
Payment price

Example:
100
payme_signature
string
PayMe's signature for the payment

Example:
0efd912d7dc26c658f841e577afa2b79
payme_transaction_id
string
PayMe transaction ID

Example:
TRAN1635-8638707F-FDCJJP3T-0IJMAP8K
payme_transaction_total
string
Transaction total amount

Example:
1000
payme_transaction_card_brand
string
The card brand

Example:
Visa
payme_transaction_auth_number
string
Transaction authorization number

Example:
5973894
payme_transaction_voucher
string
PayMe's transaction voucher

Example:
116790
buyer_name
string
Buyer's full name

Example:
John Doe
buyer_email
string
Buyer's email address

Example:
Test@example.com
buyer_phone
string
Buyer's phone number

Example:
+972520000000
buyer_card_mask
string
Card mask

Example:
458045******4580
buyer_card_exp
string
Buyer's card expiration date

Example:
10/26
buyer_card_is_foreign
boolean
Is the card foreign or domestic? (For IL Sellers only)

buyer_social_id
string
Buyer's social ID number

Example:
999999999
installments
number
Number of installments used for the payment

Example:
12
sale_paid_date
string
Sale paid date

Example:
2021-11-02 16:36:13


-----

{
  "seller_payme_id": "MPLDEMO-MPLDEMO-MPLDEMO-1234567",
  "sale_price": "1000",
  "currency": "ILS",
  "installments": "1",
  "buyer_email": "test@test.com",
  "buyer_name": "Test User",
  "language": "en",
  "sale_callback_url": "https://www.example.com/payment/callback",
  "sale_return_url": "https://www.example.com/payment/success",
  "capture_buyer": 0,
  "payme_sale_id": "Copy here payme_sale_id from generate-sale request",
  "credit_card_number": 4111111111111111,
  "credit_card_exp": "0322",
  "credit_card_cvv": 123
}
Send API Request

Staging
curl --request POST \
  --url https://sandbox.payme.io/api/pay-sale \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "seller_payme_id": "MPLDEMO-MPLDEMO-MPLDEMO-1234567",
  "sale_price": "1000",
  "currency": "ILS",
  "installments": "1",
  "buyer_email": "test@test.com",
  "buyer_name": "Test User",
  "language": "en",
  "sale_callback_url": "https://www.example.com/payment/callback",
  "sale_return_url": "https://www.example.com/payment/success",
  "capture_buyer": 0,
  "payme_sale_id": "Copy here payme_sale_id from generate-sale request",
  "credit_card_number": 4111111111111111,
  "credit_card_exp": "0322",
  "credit_card_cvv": 123
}'
{
  "status_code": 0,
  "payme_status": "success",
  "payme_sale_id": "SALE1635-XXXXXXXX-XXXXXXXX-O0POYBAJ",
  "payme_sale_code": 809283,
  "sale_created": "2021-11-02 16:36:13",
  "payme_sale_status": "completed",
  "sale_status": "completed",
  "currency": "USD",
  "transaction_id": "12345",
  "is_token_sale": true,
  "price": 100,
  "payme_signature": "0efd912d7dc26c658f841e577afa2b79",
  "payme_transaction_id": "TRAN1635-8638707F-FDCJJP3T-0IJMAP8K",
  "payme_transaction_total": "1000",
  "payme_transaction_card_brand": "Visa",
  "payme_transaction_auth_number": "5973894",
  "payme_transaction_voucher": "116790",
  "buyer_name": "John Doe",
  "buyer_email": "Test@example.com",
  "buyer_phone": "+972520000000",
  "buyer_card_mask": "458045******4580",
  "buyer_card_exp": "10/26",
  "buyer_card_is_foreign": true,
  "buyer_social_id": "999999999",
  "installments": 12,
  "sale_paid_date": "2021-11-02 16:36:13"
}

------

POS
Export
v1.0
PayMe POS Module
Introduction
The POS Module is part of our Payments API, designed to allow platforms, merchants and PSPs to process card-present EMV transactions.

Supported Payment Methods
Cards - Visa, Mastercard, American Express, Diners Club
Apple Pay
Google Pay
Samsung Pay
PayPal
Sodexo Cibus
10bis
Pepper Pay
bit
WeChat
Alipay
Monyx Wallet
Integration Prerequisite
Before beginning the integration, make sure you have the following:

Item	Description
payme_client_key	Your private key provided by us for authentication
seller_payme_id	Your Merchant's unique ID in our system
Active POS service	The Merchant must have an active POS value-added-service in his account
POS/ECR device	A supported physical device
POS Setup
Since the payment terminal is not directly connected to the client application a pairing process needs to be done between the POS/ECR and the terminal, this process is described in the pair and authenticate methods.

Pair
(See endpoint) This method is used to pair a stand-alone terminal to a POS/ECR. Each stand-alone terminal has a unique ID that is used in the paring process, this method is called first and then the pairing process is finalized by calling the authenticate method.Target URLs

Environment	URL
Staging	https://preprod.paymeservice.com/api/vas/pos/pair
Production	https://ng.paymeservice.com/api/vas/pos/pair
Authenticate
(See endpoint) This method completes the pairing process started with the pair method.Target URLs

Environment	URL
Staging	https://preprod.paymeservice.com/api/vas/pos/authenticate
Production	https://ng.paymeservice.com/api/vas/pos/authenticate
POS Payment
The payment flow is synchronous, which means that the payment result will be returned in the response. There is no need to poll the status.

Please go over the full details of the generate-sale method in our PayMe Marketplace API documentation.The main change you should make to the request, is setting the sale_payment_method parameter to emv.Target URLs

Environment	URL
Staging	https://preprod.paymeservice.com/api/generate-sale
Production	https://ng.paymeservice.com/api/generate-sale
Payment
Calling this method will "push" a payment request to the POS, synchronously awaiting the payment result. You should use the sale_payme_id value received from the generate-sale method.Target URLs

Environment	URL
Staging	https://preprod.paymeservice.com/api/sales/{payme_sale_id}
Production	https://ng.paymeservice.com/api/sales/{payme_sale_id}



-----
New POS Payment
post
https://sandbox.payme.io/api/sales
Overview
Calling this method will "push" a payment request to the POS, synchronously awaiting the payment result.

Request
Body

application/json

application/json
seller_payme_id
string
required
PayMe's unqiue seller ID

Example:
MPLXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX
product_name
string
required
Product's description

Example:
Product Name
sale_price
number
required
Sale Price

Example:
100
sale_type
string
You can find all the sale types here.

Example:
1
currency
string
Sale currency. 3-letter ISO 4217 name.

Example:
ILS
transaction_id
string
required
Transaction ID

Example:
12345
sale_callback_url
string
required
Sale Callback URL

Example:
https://www.example.com/callback_payment
payment
object
required
method
string
required
Payment method

Example:
pos
pos_id
string
required
The ID you must choose for your POS. Must be a string of digits, between "001" and "999"

Example:
001
customer
object
The customer object is not mandatory.
If this object is added to the request, it should include its required fields: name, email and phone.

name
string
Customer name

Example:
John Doe
email
string
Customer email

Example:
example@test.com
zip_code
string
Customer address zip code

Example:
837592
phone
string
Customer mobile phone number

Example:
+498963648018
social_id
string
Customer social ID / national ID for additional verification

Example:
123456782
language
string
Customer language

Example:
he
Responses
200
500
Body

application/json

application/json
status_code
number
Status of the request (0 - success, 1 - error)Show all...

sale_url
string
The URL of the IFRAME secured payment form to display to the buyerShow all...

Match pattern:
https://preprod.paymeservice.com/sale/generate/XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX
payme_sale_id
string
Our unique sale IDShow all...

Match pattern:
XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX
payme_sale_code
number
Our unique sale code (for display purposes only)Show all...

price
number
Sale final price. For example, if the price is 50.75 (max 2 decimal points) the value that needs to be sent is 5075Show all...

transaction_id
string
Merchant's unique sale ID for correlation with usShow all...

Match pattern:
12345
currency
string
Sale currency. 3-letter ISO 4217 nameShow all...

Allowed values:
USD
ILS
EUR
GBP


------


Order New POS Device
post
https://sandbox.payme.io/api/vas-enable
Overview
In order to be initiate the process of receiving a physical Point Of Sale (POS) device, you will first need to generate a new request to https://.payme.io/api/vas-enable using your personal VAS identifier.

Once the VAS is activated, the process will be initiated and the following operations will take place:

New terminal request (takes up to 5 business days)
Physical device internal preparation (Immediate once terminal is ready)
The API request for activating the service will look as follows:

1st step
Add the payment method via vas-enable

{
"payme_client_key": "payme_client_key",
"seller_payme_id": "seller_payme_id",
"vas_payme_id": "vas_payme_id"
}
2nd step
Add the device type via vas-enable

{
"payme_client_key": "payme",
"seller_payme_id":"MPL15991-MPL15991-MPL15991-MPL15991",
"vas_payme_id": "VASL1545-8192915E-8192915E-8192915E",
"extend_items": true,
"vas_data": {
"number_of_devices": 3,
"items":[
{
"pos_id": "123",
"shipping_address": "address of shipping",
"name": "name of the device"
},
{
"pos_id": "123",
"shipping_address": "address of shipping",
"name": "name of the device"
}
]
}
}
Once the VAS is activated, the process will be synchronous and there's no further action required to be completed by the partner or seller until receiving the device and starting to process immidiately.

Request
Body

application/json

application/json
payme_client_key
string
required
The PayMe Secret Client Key

Example:
payme
seller_payme_id
string
required
The unique seller identifier (MPL).

Example:
MPLDEMO-MPLDEMO-MPLDEMO-MPLDEMO
vas_payme_id
string
required
The unique activation key.

Example:
VASLDEMO-VASLDEMO-VASLDEMO-VASLDEMO
vas_data
object
required
The predefined data object that allows you to request specific device amount and a per device information.

number_of_devices
integer
required
The number of requested devices.

Example:
1
items
array[object]
required
The devices array. The items count must be equal to number_of_devices value.

extend_items
boolean
required
Responses
200
OK

Body

application/json

application/json
status_code
string
The status code.

Example:
0
seller_payme_id
string
The unique seller ID.

Example:
MPLDEMO-MPLDEMO-MPLDEMO-MPLDEMO
message
string
The message for either success of failure.

Example:
Action Completed Successfully.

----

Refund POS Sale
put
https://sandbox.payme.io/api/sales
In order to refund a sale paid via a POS device, you can use PUT function which will trigger a manual refund request sent back to the device.

You will need to chain the sale GUID unique identifier to the endpoint URL in the following form:
https://<env>.payme.io/api/sales/{sale_guid}

Example:
https://<env>.payme.io/api/sales/SALEGUID-TEST123-TEST123-TEST123

The request will trigger a refund that will be sent to the designated device per the device ID mentioned in the request (see request example below)

Request
Body

application/json

application/json
seller_payme_id
string
PayMe's unqiue seller ID

Example:
MPLXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX
product_name
string
Product's description

Example:
Product Name
currency
string
Sale currency. 3-letter ISO 4217 name.

Example:
ILS
transaction_id
string
The external transaction ID.

Example:
12345
sale_callback_url
string
The callback url for the specific sale.

Example:
https://www.example.com/callback_payment
payment
object
The payment object.

method
string
The payment method.

Example:
pos
pos_id
string
The POS ID - the device that will be used to process the refund request.

Example:
001
action
string
The action - must be refund in order to complete this action.

Example:
refund
amount
string
The sale amount in Agorot

Example:
10000
language
string
The language of the customer's interface.

Example:
he
Responses
200
OK

Body

application/json

application/json
responses
/
200
/
sale_paid_date
status_code
integer
PayMe's payment status (success/failure)

Example:
0
payme_status
string
Sale status

Example:
success
payme_sale_id
string
PayMe's unique Sale ID

Example:
SALE1635-XXXXXXXX-XXXXXXXX-O0POYBAJ
payme_sale_code
integer
PayMe's unique Sale code

Example:
809283
sale_created
string
The date the sale was created (timestamp)

Example:
2021-11-02 16:36:13
payme_sale_status
string
PayMe's sale status

Example:
completed
sale_status
string
Sale status

Example:
completed
currency
string
Sale currency. 3-letter ISO 4217 name.

Example:
ILS
transaction_id
string
Transaction ID

Example:
12345
is_token_sale
boolean
Was the card tokenized or not

price
integer
Payment price

Example:
100
payme_signature
string
PayMe's signature for the payment

Example:
0efd912d7dc26c658f841e577afa2b79
sale_description
string
Sale description

Example:
Description
payme_transaction_id
string
PayMe transaction ID

Example:
TRAN1635-8638707F-FDCJJP3T-0IJMAP8K
payme_transaction_total
string
Transaction total amount

Example:
1000
payme_transaction_card_brand
string
The card brand

Example:
Visa
payme_transaction_auth_number
string
Transaction authorization number

Example:
5973894
buyer_name
string
Buyer's full name

Example:
John Doe
buyer_email
string
Buyer's email address

Example:
Test@example.com
buyer_phone
string
Buyer's phone number

Example:
+972520000000
buyer_card_mask
string
Card mask

Example:
458045******4580
buyer_card_exp
string
Buyer's card expiration date

Example:
10/26
buyer_card_is_foreign
boolean
Is the card foreign or domestic? (For IL Sellers only)

buyer_social_id
string
Buyer's social ID number

Example:
999999999
installments
integer
Number of installments used for the payment

Example:
12
sale_paid_date
string
Sale paid date

Example:
2021-11-02 16:36:13


-----

Generate Sale with Apple Pay
post
https://sandbox.payme.io/api/generate-sale
Overview
In order to initiate the process of paying using Apple Pay APM, you will first need to initiate a generate-sale request to our API.

The request shall include "apple-pay" as the sale_payment_method.

Request
Body

application/json

application/json
seller_payme_id
string
required
Our unique seller ID (MPL).

Example:
MPLDEMO-MPLDEMO-MPLDEMO-1234567
sale_price
string
required
The sale price.

Example:
1000
currency
string
required
The sale currency (ISO 4217 Code).

Example:
ILS
product_name
string
required
What is the payment for.

Example:
T-Shirt
language
string
The language of the user interface.

Example:
he
sale_payment_method
any
required
The payment method used for the transaction.

Allowed value:
apple-pay
sale_type
string
required
The required sale type.

Example:
sale

{
  "seller_payme_id": "MPLDEMO-MPLDEMO-MPLDEMO-1234567",
  "sale_price": "1000",
  "currency": "ILS",
  "product_name": "T-Shirt",
  "language": "he",
  "sale_payment_method": "apple-pay",
  "sale_type": "sale"
}


curl --request POST \
  --url https://sandbox.payme.io/api/generate-sale \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
  "seller_payme_id": "MPLDEMO-MPLDEMO-MPLDEMO-1234567",
  "sale_price": "1000",
  "currency": "ILS",
  "product_name": "T-Shirt",
  "language": "he",
  "sale_payment_method": "apple-pay",
  "sale_type": "sale"
}'



-----

Create Payment With Buyer Key (Token)
Allows for token capture upon the buyer's payment (submission of payment details).

Attribute	Description
sale_type	= token, once the buyer completes the payment, you will receive a callback containing a token known as the "buyer_key."
sale_callback_url	URL address for receiving the callback.
Process Flow
Create a sale with generate-sale according to the special attributes in the table above.
Once the sale is created, you will get a sale_url for the payment page and a unique payme_sale_code.
After the buyer insert the payment details and pay for the sale, you will receive a callback to the dedicated callback URL you entered in the generate-sale request. The callback contains the buyer_key, which is the token.
Payment Capabilities
You can find all the payment capabilities here.

---


Israeli Direct Debit
In order to create a direct debit mandate for Israeli customers, you can use our generate-sale API endpoint to complete the two actions of:

Generating a mandate request.
Generating a new payment request.
Generating a new bank authorization
Prerequisits
Activating the service via vas-enable endpoint or the app marketplace.
The solution is based on our iFrame, where the following details will be collected:

Account type (Invididual/Company/Non-Profit/etc)
Account Owner Name
Account Owner Social ID/Business Code
Email Address
Phone Number
Bank
Bank Branch
Bank Account Number
Signature
In order to create a new bank authorization request, you will need to initiate the following request:

POST https://<env>.payme.io/api/generate-sale
{
"seller_payme_id": "MPLTEST",
"sale_price": "1000",
"currency": "ILS",
"product_name": "Shirt",
"sale_payment_method": "il-direct-debit",
"sale_type": "token"
}
Please note that all fields are mandatory even though no actual charge will be captured for this type of sale.

The response will include a URL for our iframe for the user to insert the details:

{
"status_code": 0,
"sale_url": "https://sandbox.payme.io/sale/generate/SALEGUID",
"payme_sale_id": "SALEGUID",
"payme_sale_code": 123456,
"price": 100,
"transaction_id": "",
"currency": "ILS",
"sale_payment_method": "il-direct-debit"
}
Once the bank authorization request was successfully created, the token for the buyer will remain inactive until we receive an official update from the bank that the authorization was successfully created and the account can be charged - this process can take up to 7 work days.

Creating a new payment request using the Israeli Direct Debit Payment Method
In order to create a new payment request using the IL DD, you will need to use our generate-sale API in the following form:

{
"seller_payme_id": "MPLTEST",
"sale_price": "1000",
"currency": "ILS",
"product_name": "Shirt",
"language": "en",
"sale_payment_method": "il-direct-debit",
"sale_type": "sale",
"buyer_key": "BUYER1234"
}
If the charging request was succesful, you will receive the following response:

{
"status_code": 1,
"payme_status": "success",
"status_error_code": null,
"payme_sale_id": "SALEGUID",
"payme_sale_code": 1088759,
"sale_created": "2022-07-03 08:52:16",
"payme_sale_status": "pending",
"sale_status": "initial",
"currency": "ILS",
"transaction_id": "",
"is_token_sale": false,
"price": 1000,
"payme_signature": "signatureID",
"sale_deferred_months": null,
"payme_transaction_id": "TRANGUID",
"payme_transaction_total": "1000",
"payme_transaction_card_brand": "PrivateLabel",
"payme_transaction_auth_number": null,
"payme_transaction_voucher": null,
"payme_transaction_emv_uid": null,
"payme_transaction_acquirer": null,
"payme_transaction_auth_source": null,
"payme_transaction_card_issuer": null,
"payme_transaction_credit_type": null,
"buyer_name": "Ran Tester",
"buyer_email": "TestTest@paymeservice.com",
"buyer_phone": "05222222",
"buyer_card_mask": null,
"buyer_card_exp": null,
"buyer_card_is_foreign": false,
"buyer_social_id": "123456789",
"installments": 1,
"transaction_first_payment": "1000",
"transaction_periodical_payment": 0,
"sale_paid_date": "2022-07-03 08:54:10",
"sale_release_date": null,
"sale_3ds": false
}
In this phase, the payment request will go through a process of validation with the related bank. The approval will be received after 8 calendar days - a decline will be received earlier than that. Both approval and declines can be communicated using our callback system.

Authorization Cancellations and Revokes
The bank is eligible to revoke an authorization at any point of time - this means that once an authorization is revoked, PayMe will update the token to be inactive and you won't be able to use it for new payments anymore. The update can be communicated using our callback system to your designated URL.


------
Multi-Capture - Credit Cards
The guide will be a run-through the process of using our Multi-Capture logic for card payments.

In order to initiate the process, you'll need to make sure the following prerequists:

Atleast 2 users from the same marketplace (partner account)
Credit card in hand for the authorization flow.
1st Step - Authorization
In the 1st step, you will need to create a new payment intent using our APIs:

generate-sale
sales (Combination of both generate + pay sale actions)
Requests Examples
generate-sale - https://<env>.payme.io/api/generate-sale

{
"seller_payme_id": "MPL15130-83274SO0-DEMOTEST-DEMOTEST",
"sale_price": "100",
"currency": "ILS",
"product_name": "Shirt",
"language": "en",
"sale_type": "authorize"
"sale_payment_method": "credit-card"
}
sales / generate-sale with buyer_key - https://<env>.payme.io/api/sales

{
"seller_payme_id": "680DABCB-TESTMPL-384516B5-16B55EBE",
"product_name": "Verfication test",
"sale_price": 500,
"currency": "ILS",
"payment": {
"method": "credit-card",
"card_number": "1234567891011121",
"card_expiry": "1224",
"card_cvv": "123"
},
"customer": {
"name": "First Name",
"email": "test@example.com",
"phone": "+15417543010",
"social_id": "123456782",
"zip_code": "1234567"
}
}
Expected Response
generate-sale response example:

{
"status_code": 0,
"sale_url": "https://<env>.payme.io/sale/generate/SALEGUID",
"payme_sale_id": "SALEGUID",
"payme_sale_code": sale_id,
"price": 100,
"transaction_id": "",
"currency": "ILS",
"sale_payment_method": "credit-card"
}
sales response example:

{
"status_code": 0,
"payme_status": "success",
"status_error_code": 0,
"payme_sale_id": "SALEGUID",
"payme_sale_code": 1185468,
"sale_created": "2022-11-27 18:29:06",
"payme_sale_status": "completed",
"sale_status": "completed",
"currency": "USD",
"transaction_id": "",
"is_token_sale": false,
"price": 500,
"payme_signature": "SIGNATUREID",
"sale_description": "Shirt",
"sale_deferred_months": null,
"payme_transaction_id": "TRANGUID",
"payme_transaction_total": "500",
"payme_transaction_card_brand": "Visa",
"payme_transaction_auth_number": "AUTHNO.",
"payme_transaction_voucher": "VOUCHERNO.",
"payme_transaction_emv_uid": null,
"payme_transaction_acquirer": "PayMe",
"payme_transaction_auth_source": "VoiceMail",
"payme_transaction_card_issuer": "Visa",
"payme_transaction_credit_type": "RegularCredit",
"buyer_name": "First Name",
"buyer_email": "test@example.com",
"buyer_phone": "+15417543010",
"buyer_card_mask": "458045******4580",
"buyer_card_exp": "1224",
"buyer_card_is_foreign": false,
"buyer_social_id": "123456782",
"installments": 1,
"transaction_first_payment": "500",
"transaction_periodical_payment": 0,
"transaction_arn": null,
"sale_paid_date": "2022-11-27 18:29:06",
"sale_release_date": null,
"sale_3ds": false,
"redirect_url": null
}
2nd Step - Multi Capturing
In order to use our multi-capture feature, you'll need to create new payment intents using either of the methods described in step 1, with an additonal unique parameters:

Parameter Name	Parameter Type	Parameter Description
sale_type	string	The new sale type for capturing the authorize - multi-capture.
origin_sale_id	string	The original sale GUID (ID) that was received when completing the authorization action.
You can use the following methods:

generate-sale request example:

{
"seller_payme_id": "MPL15130-TESTMPL-DEMOTEST-DEMOTEST",
"sale_price": "100",
"currency": "ILS",
"product_name": "Shirt",
"language": "en",
"sale_type": "multi-capture",
"origin_sale_id": "SALEGUID",
"sale_payment_method": "credit-card"
}
sales request example:

{
"seller_payme_id": "680DABCB-TESTMPL-384516B5-16B55EBE",
"product_name": "Verfication test",
"sale_price": 500,
"currency": "ILS",
"origin_sale_id": "SALEGUID",
"sale_type": "multi-capture"
"payment": {
"method": "credit-card"
},
"customer": {
"name": "First Name",
"email": "test@example.com",
"phone": "+15417543010",
"social_id": "123456782",
"zip_code": "1234567"
}
}
Response Example
{
"status_code": 0,
"payme_sale_id": "SALE1669-DEMODEMO-DEMODEMO-D4XZCQSV",
"payme_sale_code": 123456,
"price": 10000,
"transaction_id": "",
"currency": "ILS",
"sale_payment_method": "credit-card",
"redirect_url": null,
"transaction_cc_auth_number": "123456",
"payme_transaction_auth_number": "123456",
"sale_status": "completed",
"payme_status": "success",
"status_error_code": 0,
"sale_created": "2022-11-30 09:58:26",
"payme_sale_status": "completed",
"is_token_sale": false,
"payme_signature": null,
"sale_description": "Shirt",
"sale_deferred_months": null
}
Errors Handling


------
Multi Payment Page
Also known as “Template Sale”. Enables payments on a single sale link, by multiple buyers.
For example, you will be able to generate a single sale and share its payment link on any social network site to allow multiple customers to pay on their own.
Every payment will create a new sale with a different ID. Creation of a template sale should be done by adding the sale_type="template" attribute to the request:

Attribute	Description
sale_type	= template, creates a new sale as a template. The template sale link does not expire.
Payment Capabilities
You can find all the payment capabilities here.


