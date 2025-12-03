{
	"info": {
		"_postman_id": "587d4049-7b7c-48b1-961e-2120be3e08dc",
		"name": "PayMe API Collection v1.0.0",
		"description": "# Docs & API Reference\n\n## [🌺 Welcome](https://payme.stoplight.io/#-welcome)\n\nIn our documentation you will be able to learn about our products and how to integrate to our APIs.\n\n| **Payments** | **B2B Payments** | **Bookkeeping & Invoicing** | **Value Added Services** | **Resrources** |\n| --- | --- | --- | --- | --- |\n| [Online Payments](https://payme.stoplight.io/docs/payments/branches/V1.6/qzuwpe58p2wjw-integration-options) | [Smart Contracts](https://payme.stoplight.io/docs/4-b2b-payments---api-reference/branches/V1.6/u8vyyrknn5jn8-contracts) | [Creating Documents](https://payme.stoplight.io/docs/payments/branches/V1.6/0a76d2a3e52c3-documents) | [3DSecure](https://payme.stoplight.io/docs/payments/branches/V1.6/7b07ba359d48e-generate-a-sale-with-3-d-secure) | [Getting Started](https://docs.payme.io/docs/guides/2127e5736c667-israeli-mcc-list) |\n| [Marketplace Payments](https://payme.stoplight.io/docs/payments/branches/V1.6/1840bzrqlh9vn-platforms-and-marketplaces) | Closed Loop Payments | Retrieving Documents | [Tokenization Service](https://payme.stoplight.io/docs/payments/branches/V1.6/azxijnfcfn1l9-tokenization) | [Help Center](https://help.payme.co.il/hc/en-us) |\n| [Recurring Payments](https://payme.stoplight.io/docs/payments/branches/V1.6/s5v5chw9si9dj-recurring-payments) |  |  |  | Reporting API & Dashboard |\n| [POS Payments](https://payme.stoplight.io/docs/payments/branches/V1.6/cdc3d4cf41590-pos) |  |  |  |  |\n\nYou can find two sectionsin our docs:\n\n- Guides - Product and integration overview\n    \n- API Reference - Technical integration information\n    \n\nThose sections provide you with full package on how you integrate our proudcts.\n\nWe strognly recommend you to go over the guides before completing the technical integration.\n\nHave a particular problem you're looking to solve? Explore these use cases. [Learn more](https://docs.payme.io/docs/guides/a21c381be612c-use-cases)\n\n## [🏁 Getting Started](https://payme.stoplight.io/#-getting-started)\n\nLearn the basics - Explore our solutions either by following the [\"Getting Started\" article](https://payme.stoplight.io/docs/payments/qgo6pq670hah0-getting-started) or by navigating through the side panel.\n\n## [💡 FAQ and Help Center](https://payme.stoplight.io/#-faq-and-help-center)\n\nIn case of any questions or doubts, be sure to check our help center or contact our support - [Click here to our help center](https://help.payme.co.il/hc/en-us).\n\n## [⚙️ Status Page](https://payme.stoplight.io/#%EF%B8%8F-status-page)\n\nOur [Status Page](https://status.payme.io/) is available 24/7, you can now subscribe and receive notifications regarding maintenance, issues or general updates to your inbox.",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "25963213",
		"_collection_link": "https://lively-crescent-330380.postman.co/workspace/Team-Workspace~83ce3625-a5d7-44a2-833e-4b1de86050a1/collection/42558012-587d4049-7b7c-48b1-961e-2120be3e08dc?action=share&source=collection_link&creator=25963213"
	},
	"item": [
		{
			"name": "Payment Options",
			"item": [
				{
					"name": "Hosted Payment Page",
					"item": [
						{
							"name": "Generate Payment",
							"event": [
								{
									"listen": "test",
									"script": {
										"exec": [
											"pm.test(\"Response status code is 200\", function () {\r",
											"    pm.expect(pm.response.code).to.equal(200);\r",
											"});\r",
											"\r",
											"\r",
											"pm.test(\"Response time is less than 700ms\", function () {\r",
											"  pm.expect(pm.response.responseTime).to.be.below(700);\r",
											"});\r",
											"\r",
											"\r",
											"pm.test(\"Response has the required fields\", function () {\r",
											"  const responseData = pm.response.json();\r",
											"  \r",
											"  pm.expect(responseData).to.be.an('object');\r",
											"  pm.expect(responseData).to.include.all.keys('status_code', 'sale_url', 'payme_sale_id', 'payme_sale_code', 'price', 'transaction_id', 'currency', 'sale_payment_method', 'session');\r",
											"});\r",
											"\r",
											"\r",
											"pm.test(\"Status code is a non-negative integer\", function () {\r",
											"    const responseData = pm.response.json();\r",
											"    \r",
											"    pm.expect(responseData.status_code).to.be.a('number');\r",
											"    pm.expect(responseData.status_code).to.be.at.least(0);\r",
											"});\r",
											"\r",
											"\r",
											"pm.test(\"Price is a non-negative number\", function () {\r",
											"  const responseData = pm.response.json();\r",
											"  \r",
											"  pm.expect(responseData).to.be.an('object');\r",
											"  pm.expect(responseData.price).to.be.a('number');\r",
											"  pm.expect(responseData.price).to.be.at.least(0);\r",
											"});\r",
											""
										],
										"type": "text/javascript",
										"packages": {}
									}
								},
								{
									"listen": "prerequest",
									"script": {
										"exec": [
											""
										],
										"type": "text/javascript",
										"packages": {}
									}
								}
							],
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"seller_payme_id\": \"{{seller_payme_id}}\",\n    \"sale_price\": 1000,\n    \"currency\": \"ILS\",\n    \"product_name\": \"Smartphone\",\n    \"transaction_id\": \"12345\",\n    \"installments\": \"1\",\n    \"market_fee\": 0.5,\n    \"sale_send_notification\": true,\n    \"sale_callback_url\": \"{{sale_callback_url}}\",\n    \"sale_email\": \"test@testmail.com\",\n    \"sale_return_url\": \"{{sale_return_url}}\",\n    \"sale_mobile\": \"+972525888888\",\n    \"sale_name\": \"John Doe\",\n    \"capture_buyer\": \"0\",\n    \"sale_type\": \"sale\",\n    \"sale_payment_method\": \"credit-card\",\n    \"language\": \"he\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/generate-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"generate-sale"
									]
								}
							},
							"response": [
								{
									"name": "Success Response",
									"originalRequest": {
										"method": "POST",
										"header": [],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"status_code\": 0,\n  \"sale_url\": \"https://sandbox.paymeservice.com/sale/generate/XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_id\": \"XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_code\": 12345678,\n  \"price\": 10000,\n  \"transaction_id\": \"12345\",\n  \"currency\": \"ILS\"\n}"
										},
										"url": {
											"raw": ""
										}
									},
									"_postman_previewlanguage": "Text",
									"header": [],
									"cookie": [],
									"body": ""
								}
							]
						},
						{
							"name": "Generate Payment Bit",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"seller_payme_id\": \"{{seller_payme_id}}\",\n    \"sale_price\": 1000,\n    \"currency\": \"ILS\",\n    \"product_name\": \"Smartphone\",\n    \"transaction_id\": \"12345\",\n    \"installments\": \"1\",\n    \"market_fee\": 0.5,\n    \"sale_send_notification\": true,\n    \"sale_callback_url\": \"{{sale_callback_url}}\",\n    \"sale_email\": \"test@testmail.com\",\n    \"sale_return_url\": \"{{sale_return_url}}\",\n    \"sale_mobile\": \"+972525888888\",\n    \"sale_name\": \"John Doe\",\n    \"capture_buyer\": \"0\",\n    \"sale_type\": \"sale\",\n    \"sale_payment_method\": \"credit-card\",\n    \"language\": \"he\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/generate-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"generate-sale"
									]
								}
							},
							"response": [
								{
									"name": "Success Response",
									"originalRequest": {
										"method": "POST",
										"header": [],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"status_code\": 0,\n  \"sale_url\": \"https://sandbox.paymeservice.com/sale/generate/XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_id\": \"XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_code\": 12345678,\n  \"price\": 10000,\n  \"transaction_id\": \"12345\",\n  \"currency\": \"ILS\"\n}"
										},
										"url": {
											"raw": ""
										}
									},
									"_postman_previewlanguage": "Text",
									"header": [],
									"cookie": [],
									"body": ""
								}
							]
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				},
				{
					"name": "Hosted Fields - JSAPI",
					"item": [
						{
							"name": "Generate Payment with Token",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sale_price\": 1000,\n  \"currency\": \"ILS\",\n  \"product_name\": \"Smartphone\",\n  \"capture_buyer\": \"1\",\n  \"buyer_key\": \"BUYER168-XXXXXXXX-XXXXXXXX-WQIWVVLB\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/generate-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"generate-sale"
									]
								}
							},
							"response": []
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				},
				{
					"name": "Before Sale Actions",
					"item": [
						{
							"name": "Authorization Sale",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"seller_payme_id\": \"{{seller_payme_id}}\",\n    \"sale_price\": 1000,\n    \"currency\": \"ILS\",\n    \"product_name\": \"Smartphone\",\n    \"transaction_id\": \"12345\",\n    \"installments\": \"1\",\n    \"market_fee\": 0.5,\n    \"sale_send_notification\": true,\n    \"sale_callback_url\": \"{{sale_callback_url}}\",\n    \"sale_email\": \"test@testmail.com\",\n    \"sale_return_url\": \"{{sale_return_url}}\",\n    \"sale_mobile\": \"+972525888888\",\n    \"sale_name\": \"John Doe\",\n    \"capture_buyer\": \"0\",\n    \"sale_type\": \"sale\",\n    \"sale_payment_method\": \"credit-card\",\n    \"language\": \"he\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/generate-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"generate-sale"
									]
								}
							},
							"response": [
								{
									"name": "Success Response",
									"originalRequest": {
										"method": "POST",
										"header": [],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"status_code\": 0,\n  \"sale_url\": \"https://sandbox.paymeservice.com/sale/generate/XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_id\": \"XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_code\": 12345678,\n  \"price\": 10000,\n  \"transaction_id\": \"12345\",\n  \"currency\": \"ILS\"\n}"
										},
										"url": {
											"raw": ""
										}
									},
									"_postman_previewlanguage": "Text",
									"header": [],
									"cookie": [],
									"body": ""
								}
							]
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				},
				{
					"name": "Direct API",
					"item": [
						{
							"name": "Pay Sale",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sale_price\": \"1000\",\n  \"currency\": \"ILS\",\n  \"installments\": \"1\",\n  \"buyer_email\": \"test@test.com\",\n  \"buyer_name\": \"Test User\",\n  \"language\": \"en\",\n  \"sale_callback_url\": \"{{sale_callback_url}}\",\n  \"sale_return_url\": \"{{sale_return_url}}\",\n  \"capture_buyer\": 0,\n  \"payme_sale_id\": \"SALE1635-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"credit_card_number\": 4111111111111111,\n  \"credit_card_exp\": \"0322\",\n  \"credit_card_cvv\": 123\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/pay-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"pay-sale"
									]
								}
							},
							"response": []
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				},
				{
					"name": "Post Sale Actions",
					"item": [
						{
							"name": "Refund Sale",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"payme_sale_id\": \"SALEDEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"sale_refund_amount\": 500,\n  \"language\": \"he\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/refund-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"refund-sale"
									]
								}
							},
							"response": []
						},
						{
							"name": "Void Sale",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"payme_sale_id\": \"SALEDEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"sale_currency\": \"USD\",\n  \"language\": \"he\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/refund-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"refund-sale"
									]
								}
							},
							"response": []
						},
						{
							"name": "Capture Sale",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"payme_sale_id\": \"SALEDEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/capture-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"capture-sale"
									]
								}
							},
							"response": []
						},
						{
							"name": "Cancel Multi-Payment Page",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"payme_sale_id\": \"SALEDEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/cancel-template",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"cancel-template"
									]
								}
							},
							"response": []
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				},
				{
					"name": "Point Of Sale",
					"item": [
						{
							"name": "Order New POS Device",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"vas_payme_id\": \"VASL1545-8192915E-8192915E-8192915E\",\n  \"extend_items\": true,\n  \"vas_data\": {\n    \"number_of_devices\": 1,\n    \"items\": [\n      {\n        \"pos_id\": \"123\",\n        \"shipping_address\": \"address of shipping\",\n        \"name\": \"name of the device\"\n      }\n    ]\n  }\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/vas-enable",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"vas-enable"
									]
								}
							},
							"response": []
						},
						{
							"name": "New POS Payment",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"string\",\n  \"product_name\": \"string\",\n  \"sale_price\": 0,\n  \"currency\": \"USD\",\n  \"transaction_id\": \"string\",\n  \"sale_callback_url\": \"string\",\n  \"payment\": {\n    \"method\": \"pos\",\n    \"pos_id\": \"string\"\n  },\n  \"customer\": {\n    \"name\": \"string\",\n    \"email\": \"string\",\n    \"phone\": \"string\",\n    \"zip_code\": \"string\",\n    \"social_id\": \"string\"\n  },\n  \"language\": \"he\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/sales",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"sales"
									]
								}
							},
							"response": []
						},
						{
							"name": "Refund POS Sale",
							"request": {
								"method": "PUT",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"product_name\": \"Product Name\",\n  \"currency\": \"ILS\",\n  \"transaction_id\": \"12345\",\n  \"sale_callback_url\": \"{{sale_callback_url}}\",\n  \"payment\": {\n    \"method\": \"pos\",\n    \"pos_id\": \"001\",\n    \"action\": \"refund\",\n    \"amount\": \"10000\"\n  },\n  \"language\": \"he\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/sales/{sale_guid}",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"sales",
										"{sale_guid}"
									]
								}
							},
							"response": []
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				}
			]
		},
		{
			"name": "Recurring Payments",
			"item": [
				{
					"name": "Tokenization",
					"item": [
						{
							"name": "Capture Buyer Token",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"buyer_name\": \"John Doe\",\n  \"buyer_social_id\": \"123456789\",\n  \"buyer_email\": \"test@example.com\",\n  \"buyer_phone\": \"+9720520000000\",\n  \"buyer_zip_code\": \"ab123\",\n  \"credit_card_number\": 4111111111111111,\n  \"credit_card_exp\": \"0324\",\n  \"credit_card_cvv\": 123,\n  \"buyer_perform_validation\": true\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/capture-buyer-token",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"capture-buyer-token"
									]
								}
							},
							"response": []
						},
						{
							"name": "Generate Sale with Token",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sale_price\": 100,\n  \"currency\": \"ILS\",\n  \"product_name\": \"Phone\",\n  \"transaction_id\": \"12345\",\n  \"installments\": \"1\",\n  \"market_fee\": 0.5,\n  \"sale_send_notification\": true,\n  \"sale_callback_url\": \"{{sale_callback_url}}\",\n  \"sale_email\": \"test@testmail.com\",\n  \"sale_return_url\": \"{{sale_return_url}}\",\n  \"sale_mobile\": \"+972525888888\",\n  \"sale_name\": \"John Doe\",\n  \"capture_buyer\": true,\n  \"buyer_perform_validation\": true,\n  \"sale_type\": \"string\",\n  \"sale_payment_method\": \"string\",\n  \"layout\": \"dynamic\",\n  \"language\": \"he\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/generate-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"generate-sale"
									]
								}
							},
							"response": []
						},
						{
							"name": "Get Buyer Key",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_sale_id\": \"{{seller_payme_id}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/get-buyer-key",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"get-buyer-key"
									]
								}
							},
							"response": []
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				},
				{
					"name": "Subscriptions",
					"item": [
						{
							"name": "Generate Subscription",
							"event": [
								{
									"listen": "test",
									"script": {
										"exec": [
											"var jsonData = pm.response.json();\r",
											"pm.environment.set(\"sub_payme_id\", jsonData.sub_payme_id);"
										],
										"type": "text/javascript",
										"packages": {}
									}
								}
							],
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sub_price\": 500,\n  \"sub_currency\": \"ILS\",\n  \"sub_description\": \"Annual plan\",\n  \"sub_iteration_type\": \"3\",\n  \"sub_iterations\": 1,\n  \"sub_start_date\": \"24/08/2025\",\n  \"sub_callback_url\": \"{{sub_callback_url}}\",\n  \"sub_return_url\": \"{{sub_return_url}}\",\n  \"language\": \"he\",\n  \"test\": 1\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/generate-subscription",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"generate-subscription"
									]
								},
								"description": "### Schema\n\n| Parameter | Type | Required | Description |\n|-----------|------|----------|-------------|\n| payme_client_key | string | Yes | PayMe Partner Key |\n| seller_payme_id | string | Yes | MPL private key in PayMe system |\n| sub_currency | string | Yes | 3-letter ISO 4217 currency code |\n| sub_price | string | Yes | Single iteration price (in minor units) |\n| sub_description | string | Yes | Service/product description |\n| sub_iteration_type | integer | Yes | 1=Daily, 2=Weekly, 3=Monthly, 4=Yearly |\n| language | string | No | UI language (default: he) |\n| sub_start_date | string | No | Start date (format: DD/MM/YYYY HH:mm) |\n| sub_payment_method | string | No | Payment method (e.g. credit-card) |\n| sub_type | number | No | 1=regular, 10=template |\n| buyer_key | string | No | Token for instant payment |\n| subscription_id | string | No | Merchant's unique ID |\n| sub_iterations | number | No | Number of iterations (-1=unlimited) |\n| sub_callback_url | string | No | Callback URL for subscription events |\n| sub_return_url | string | No | Success redirect URL |\n| sub_indicative_name | string | No | Subscription name |\n| sub_email_address | string | No | Payer's email |\n| sub_indicative_mobile | string | No | Receipt phone number |\n| sub_send_notification | boolean | No | Enable event notifications |"
							},
							"response": [
								{
									"name": "Generate Subscription",
									"originalRequest": {
										"method": "POST",
										"header": [
											{
												"key": "Content-Type",
												"value": "application/json",
												"type": "text"
											}
										],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sub_price\": 500,\n  \"sub_currency\": \"ILS\",\n  \"sub_description\": \"Annual plan\",\n  \"sub_iteration_type\": \"3\",\n  \"sub_iterations\": 1,\n  \"sub_start_date\": \"24/08/2025\",\n  \"sub_callback_url\": \"{{sub_callback_url}}\",\n  \"sub_return_url\": \"{{sub_return_url}}\",\n  \"language\": \"he\",\n  \"test\": 1\n}",
											"options": {
												"raw": {
													"language": "json"
												}
											}
										},
										"url": {
											"raw": "https://{{env}}.payme.io/api/generate-subscription",
											"protocol": "https",
											"host": [
												"{{env}}",
												"payme",
												"io"
											],
											"path": [
												"api",
												"generate-subscription"
											]
										}
									},
									"status": "OK",
									"code": 200,
									"_postman_previewlanguage": "json",
									"header": [
										{
											"key": "Date",
											"value": "Mon, 30 Dec 2024 13:32:35 GMT"
										},
										{
											"key": "Content-Type",
											"value": "application/json"
										},
										{
											"key": "Transfer-Encoding",
											"value": "chunked"
										},
										{
											"key": "Connection",
											"value": "keep-alive"
										},
										{
											"key": "ratelimit-reset",
											"value": "26"
										},
										{
											"key": "x-ratelimit-remaining-minute",
											"value": "58"
										},
										{
											"key": "x-ratelimit-limit-minute",
											"value": "60"
										},
										{
											"key": "ratelimit-remaining",
											"value": "58"
										},
										{
											"key": "ratelimit-limit",
											"value": "60"
										},
										{
											"key": "Cache-Control",
											"value": "no-store, private"
										},
										{
											"key": "access-control-allow-origin",
											"value": "*"
										},
										{
											"key": "referrer-policy",
											"value": "strict-origin-when-cross-origin"
										},
										{
											"key": "CF-Cache-Status",
											"value": "DYNAMIC"
										},
										{
											"key": "Strict-Transport-Security",
											"value": "max-age=15552000; includeSubDomains; preload"
										},
										{
											"key": "X-Content-Type-Options",
											"value": "nosniff"
										},
										{
											"key": "Server",
											"value": "cloudflare"
										},
										{
											"key": "CF-RAY",
											"value": "8fa2658d8fdb666c-MAD"
										},
										{
											"key": "Content-Encoding",
											"value": "br"
										}
									],
									"cookie": [],
									"body": "{\n    \"sub_url\": \"https://sandbox.payme.io/subscription/generate/SUB17355-65555J1I-G5SOMPX4-MBEEB9MC\",\n    \"status_code\": 0,\n    \"session\": \"AAb7tdhz\",\n    \"payme_status\": \"success\",\n    \"status_error_code\": 0,\n    \"seller_payme_id\": \"MPL16477-86054B1A-FVOW7RGE-MLCM3LBQ\",\n    \"seller_id\": null,\n    \"sub_payme_id\": \"SUB17355-65555J1I-G5SOMPX4-MBEEB9MC\",\n    \"sub_payme_code\": 486987,\n    \"subscription_id\": null,\n    \"sub_created\": \"2024-12-30 15:32:35\",\n    \"sub_start_date\": \"2025-08-24 07:00:00\",\n    \"sub_prev_date\": null,\n    \"sub_next_date\": \"2025-08-24 07:00:00\",\n    \"sub_status\": 1,\n    \"sub_iteration_type\": 3,\n    \"sub_currency\": \"ILS\",\n    \"sub_price\": 500,\n    \"sub_description\": \"Annual plan\",\n    \"sub_iterations\": 1,\n    \"sub_iterations_completed\": 0,\n    \"sub_iterations_skipped\": 0,\n    \"sub_iterations_left\": 1,\n    \"sub_paid\": false,\n    \"sub_error_text\": null\n}"
								}
							]
						},
						{
							"name": "Pay Subscription",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"sub_payme_id\": \"SUB16885-68336QPL-UQSSS1CC-SYKXI53N\",\n  \"credit_card_number\": \"4580458045804580\",\n  \"credit_card_cvv\": \"123\",\n  \"credit_card_exp\": \"0130\",\n  \"buyer_email\": \"test@gmail.com\",\n  \"buyer_name\": \"John Doe\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/pay-subscription",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"pay-subscription"
									]
								}
							},
							"response": []
						},
						{
							"name": "Cancel Subscription",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sub_payme_id\": \"SUB16885-68336QPL-UQSSS1CC-SYKXI53N\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/cancel-subscription",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"cancel-subscription"
									]
								}
							},
							"response": []
						},
						{
							"name": "Pause Subscription",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sub_payme_id\": \"SUBDEMO-SUBDEMO-SUBDEMO-SUBDEMO\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/pause-subscription",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"pause-subscription"
									]
								}
							},
							"response": []
						},
						{
							"name": "Resume Subscription",
							"request": {
								"method": "PATCH",
								"header": [
									{
										"key": "PayMe-Merchant-Key",
										"value": "{{merchant_key}}"
									}
								],
								"url": {
									"raw": "https://{{env}}.payme.io/api/subscriptions/{{sub_payme_id}}/resume",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"subscriptions",
										"{{sub_payme_id}}",
										"resume"
									]
								}
							},
							"response": []
						},
						{
							"name": "Update Subscription",
							"request": {
								"method": "PATCH",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\r\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\r\n  \"sub_price\": 5075\r\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/subscriptions/{{sub_id}}/set-price",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"subscriptions",
										"{{sub_id}}",
										"set-price"
									]
								}
							},
							"response": []
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				}
			]
		},
		{
			"name": "Payment Methods",
			"item": [
				{
					"name": "Apple Pay",
					"item": [
						{
							"name": "Generate Payment",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									},
									{
										"key": "Accept",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sale_price\": \"1000\",\n  \"currency\": \"ILS\",\n  \"product_name\": \"test\",\n  \"language\": \"he\",\n  \"sale_type\": \"sale\",\n  \"sale_payment_method\": \"il-direct-debit\",\n  \"sale_return_url\": \"{{sale_return_url}}\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/generate-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"generate-sale"
									]
								},
								"description": "Generate a new payment using Israeli Direct Debit payment method"
							},
							"response": [
								{
									"name": "Successful Response",
									"originalRequest": {
										"method": "POST",
										"header": [],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"seller_payme_id\": \"MPLDEMO-MPLDEMO-MPLDEMO-MPLDEMO\",\n  \"sale_price\": \"1000\",\n  \"currency\": \"ILS\",\n  \"product_name\": \"test\",\n  \"language\": \"he\",\n  \"sale_type\": \"sale\",\n  \"sale_payment_method\": \"il-direct-debit\",\n  \"sale_return_url\": \"https://payme.io\"\n}"
										},
										"url": {
											"raw": ""
										}
									},
									"status": "OK",
									"code": 200,
									"_postman_previewlanguage": "json",
									"header": [
										{
											"key": "Content-Type",
											"value": "application/json"
										}
									],
									"cookie": [],
									"body": "{\n  \"status_code\": 0,\n  \"sale_url\": \"https://sandbox.payme.io/sale/generate/SALETEST-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_id\": \"SALE1687-957072WX-0MEX63QM-GMHDMGNU\",\n  \"payme_sale_code\": 1234567,\n  \"price\": 1000,\n  \"transaction_id\": \"12345\",\n  \"currency\": \"ILS\",\n  \"sale_payment_method\": \"il-direct-debit\"\n}"
								}
							]
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				},
				{
					"name": "IL Direct Debit",
					"item": [
						{
							"name": "Generate Sale Authorization",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									},
									{
										"key": "Accept",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sale_price\": \"1000\",\n  \"currency\": \"ILS\",\n  \"product_name\": \"test\",\n  \"language\": \"he\",\n  \"sale_type\": \"token\",\n  \"sale_payment_method\": \"il-direct-debit\",\n  \"sale_return_url\": \"{{sale_return_url}}\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/generate-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"generate-sale"
									]
								},
								"description": "Generate a new sale authorization for Israeli Direct Debit payment method"
							},
							"response": [
								{
									"name": "Successful Response",
									"originalRequest": {
										"method": "POST",
										"header": [],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"seller_payme_id\": \"MPLDEMO-MPLDEMO-MPLDEMO-MPLDEMO\",\n  \"sale_price\": \"1000\",\n  \"currency\": \"ILS\",\n  \"product_name\": \"test\",\n  \"language\": \"he\",\n  \"sale_type\": \"token\",\n  \"sale_payment_method\": \"il-direct-debit\",\n  \"sale_return_url\": \"https://payme.io\"\n}"
										},
										"url": {
											"raw": ""
										}
									},
									"status": "OK",
									"code": 200,
									"_postman_previewlanguage": "json",
									"header": [
										{
											"key": "Content-Type",
											"value": "application/json"
										}
									],
									"cookie": [],
									"body": "{\n  \"status_code\": 0,\n  \"sale_url\": \"https://sandbox.payme.io/sale/generate/SALETEST-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_id\": \"SALE1687-957072WX-0MEX63QM-GMHDMGNU\",\n  \"payme_sale_code\": 1234567,\n  \"price\": 1000,\n  \"transaction_id\": \"12345\",\n  \"currency\": \"ILS\",\n  \"sale_payment_method\": \"il-direct-debit\"\n}"
								}
							]
						},
						{
							"name": "Generate Payment",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									},
									{
										"key": "Accept",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sale_price\": \"1000\",\n  \"currency\": \"ILS\",\n  \"product_name\": \"test\",\n  \"language\": \"he\",\n  \"sale_type\": \"sale\",\n  \"sale_payment_method\": \"il-direct-debit\",\n  \"sale_return_url\": \"{{sale_return_url}}\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/generate-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"generate-sale"
									]
								},
								"description": "Generate a new payment using Israeli Direct Debit payment method"
							},
							"response": [
								{
									"name": "Successful Response",
									"originalRequest": {
										"method": "POST",
										"header": [],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"seller_payme_id\": \"MPLDEMO-MPLDEMO-MPLDEMO-MPLDEMO\",\n  \"sale_price\": \"1000\",\n  \"currency\": \"ILS\",\n  \"product_name\": \"test\",\n  \"language\": \"he\",\n  \"sale_type\": \"sale\",\n  \"sale_payment_method\": \"il-direct-debit\",\n  \"sale_return_url\": \"https://payme.io\"\n}"
										},
										"url": {
											"raw": ""
										}
									},
									"status": "OK",
									"code": 200,
									"_postman_previewlanguage": "json",
									"header": [
										{
											"key": "Content-Type",
											"value": "application/json"
										}
									],
									"cookie": [],
									"body": "{\n  \"status_code\": 0,\n  \"sale_url\": \"https://sandbox.payme.io/sale/generate/SALETEST-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_id\": \"SALE1687-957072WX-0MEX63QM-GMHDMGNU\",\n  \"payme_sale_code\": 1234567,\n  \"price\": 1000,\n  \"transaction_id\": \"12345\",\n  \"currency\": \"ILS\",\n  \"sale_payment_method\": \"il-direct-debit\"\n}"
								}
							]
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				}
			],
			"description": "As PayMe offers different payment methods, you can use the `sale_payment_method` parameter in [<code>generate-sale</code>](https://payme.stoplight.io/docs/payments/branches/V1.5/d7da26bb42da8-single-payment-page) to set your desired payment method.\n\n| Payment Method | Payment Method Type | PayMe `payment_method` code | API Value |\n| --- | --- | --- | --- |\n| Credit Card | Card Payment | 1 | credit-card |\n| Bank Transfer | Bank Transfer Payment | 2 | bank-transfer |\n| PayPal | Card/Wallet Payment | 3 | paypal |\n| Alipay QR | Wallet Payment | 4 | alipay-qr |\n| Alipay Online | Wallet Payment | 5 | alipay-online |\n| Funds Transfer | Bank Transfer Payment | 6 | funds-transfer |\n| Cash | Cash Payment | 7 | cash |\n| Cheque | Cheque Payment | 8 | cheque |\n| eCheck | Online Bank Transfer | 9 | echeck |\n| Bit | Wallet | 10 | bit |\n| BACS | Online Bank Transfer | 11 | bacs |\n| SEPA | Online Bank Transfer | 12 | sepa |\n| ApplePay | Wallet | 14 | apple-pay |\n| IL Direct Debit | Online Bank Transfer | 15 | il-direct-debit |\n| Verifone Prepaid | Prepaid card | 16 | verifone-prepaid |"
		},
		{
			"name": "Platforms and Marketplaces",
			"item": [
				{
					"name": "Merchants Management",
					"item": [
						{
							"name": "Create Seller",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_first_name\": \"FirstName\",\n  \"seller_last_name\": \"LastName\",\n  \"seller_social_id\": \"564827517\",\n  \"seller_birthdate\": \"01/01/2000\",\n  \"seller_social_id_issued\": \"18/08/1995\",\n  \"seller_gender\": 0,\n  \"seller_email\": \"random@payme.com\",\n  \"seller_phone\": \"+9720520000000\",\n  \"seller_contact_email\": \"test@example.com\",\n  \"seller_contact_phone\": \"+9720520000000\",\n  \"seller_bank_code\": 10,\n  \"seller_bank_branch\": 100,\n  \"seller_bank_account_number\": \"1111111\",\n  \"seller_description\": \"An online store which specializes in smartphones\",\n  \"seller_site_url\": \"www.smartphonesmartphones.com\",\n  \"seller_person_business_type\": 10010,\n  \"seller_inc\": 1,\n  \"seller_inc_code\": \"123456\",\n  \"seller_retail_type\": 1,\n  \"seller_merchant_name\": \"string\",\n  \"seller_address_city\": \"Tel Aviv\",\n  \"seller_address_street\": \"Kaplan\",\n  \"seller_address_street_number\": \"23\",\n  \"seller_address_country\": \"IL\",\n  \"market_fee\": \"30.00\",\n  \"language\": \"he\",\n  \"seller_merchant_name_en\": \"Merchant Name\",\n  \"seller_dba\": \"Name in Hebrew\",\n  \"seller_dba_en\": \"Name in English\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/create-seller",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"create-seller"
									]
								}
							},
							"response": []
						},
						{
							"name": "Update Seller",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"seller_first_name\": \"FirstName\",\n  \"seller_last_name\": \"LastName\",\n  \"seller_social_id\": \"999999999\",\n  \"seller_birthdate\": \"01/01/2000\",\n  \"seller_social_id_issued\": \"18/08/1995\",\n  \"seller_gender\": 0,\n  \"seller_email\": \"test@example.com\",\n  \"seller_phone\": \"+9720520000000\",\n  \"seller_contact_email\": \"test@example.com\",\n  \"seller_contact_phone\": \"+9720520000000\",\n  \"seller_bank_code\": 10,\n  \"seller_bank_branch\": 100,\n  \"seller_bank_account_number\": \"1111111\",\n  \"seller_description\": \"An online store which specializes in smartphones\",\n  \"seller_site_url\": \"www.smartphonesmartphones.com\",\n  \"seller_person_business_type\": 1,\n  \"seller_inc\": 1,\n  \"seller_inc_code\": \"123456\",\n  \"seller_retail_type\": 1,\n  \"seller_merchant_name\": \"string\",\n  \"seller_address_city\": \"Tel Aviv\",\n  \"seller_address_street\": \"Kaplan\",\n  \"seller_address_street_number\": \"23\",\n  \"seller_address_country\": \"IL\",\n  \"market_fee\": \"30.00\",\n  \"language\": \"he\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/update-seller",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"update-seller"
									]
								}
							},
							"response": []
						},
						{
							"name": "Upload Seller Files",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"seller_files\": [\n    {\n      \"name\": \"document.jpg\",\n      \"type\": 0,\n      \"url\": \"https://example.com/file\",\n      \"mime_type\": \"image/jpeg\"\n    }\n  ]\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/upload-seller-files",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"upload-seller-files"
									]
								}
							},
							"response": []
						},
						{
							"name": "Retrieve Seller's Additional Services Data",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/get-vas-seller",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"get-vas-seller"
									]
								}
							},
							"response": []
						},
						{
							"name": "Withdraw Balance",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"withdrawal_currency\": \"ILS\",\n  \"language\": \"he\",\n  \"transaction_ids\": [\"TRANDEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\"]\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/withdraw-balance",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"withdraw-balance"
									]
								}
							},
							"response": []
						},
						{
							"name": "Get Seller Public Key",
							"request": {
								"method": "GET",
								"header": [
									{
										"key": "PayMe-Partner-Key",
										"value": "{{partner_key}}"
									}
								],
								"url": {
									"raw": "https://{{env}}.payme.io/api/sellers/{{seller_payme_id}}/public-keys",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"sellers",
										"{{seller_payme_id}}",
										"public-keys"
									]
								}
							},
							"response": []
						},
						{
							"name": "Delayed Market Fee",
							"request": {
								"method": "PATCH",
								"header": [
									{
										"key": "PayMe-Merchant-Key",
										"value": "{{merchant_key}}"
									},
									{
										"key": "PayMe-Partner-Key",
										"value": "{{partner_key}}"
									},
									{
										"key": "Content-Type",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"market_fee_percentage\": 59.3,\n  \"market_fee_fixed\": 1523\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/sales/{{guid}}/external-market-fee",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"sales",
										"{{guid}}",
										"external-market-fee"
									]
								}
							},
							"response": []
						},
						{
							"name": "Business Fields",
							"request": {
								"method": "GET",
								"header": [
									{
										"key": "PayMe-Partner-Key",
										"value": "payme"
									}
								],
								"url": {
									"raw": "https://{{env}}.payme.io/api/business-fields?sort_by=name_local&sort_direction=desc",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"business-fields"
									],
									"query": [
										{
											"key": "sort_by",
											"value": "name_local"
										},
										{
											"key": "sort_direction",
											"value": "desc"
										}
									]
								}
							},
							"response": []
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				},
				{
					"name": "Buyers Management",
					"item": [
						{
							"name": "Get Customer Details",
							"request": {
								"method": "GET",
								"header": [
									{
										"key": "Accept",
										"value": "application/json"
									},
									{
										"key": "PayMe-Merchant-Key",
										"value": "BUYERDEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX",
										"description": "Your unique seller UUID"
									}
								],
								"url": {
									"raw": "https://{{env}}.payme.io/api/buyers/{{buyer_guid}}",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"buyers",
										"{{buyer_guid}}"
									]
								},
								"description": "Get buyer details including card information and customer data"
							},
							"response": [
								{
									"name": "Successful Response",
									"originalRequest": {
										"method": "GET",
										"header": [],
										"url": {
											"raw": ""
										}
									},
									"status": "OK",
									"code": 200,
									"_postman_previewlanguage": "json",
									"header": [
										{
											"key": "Content-Type",
											"value": "application/json"
										}
									],
									"cookie": [],
									"body": "{\n  \"uuid\": \"2378d4c8-****-****-****-5f6abd091f1c\",\n  \"customer\": {\n    \"name\": \"John Doe\",\n    \"email\": \"test@payme.io\",\n    \"phone\": \"+9720500000000\",\n    \"social_id\": \"999999999\"\n  },\n  \"payment\": {\n    \"display\": \"123456******1111\",\n    \"expiry\": \"0324\",\n    \"brand\": \"AMEX\",\n    \"club\": \"string\",\n    \"type\": \"Debit\",\n    \"organization\": \"string\",\n    \"origin_country\": \"US\"\n  },\n  \"buyer_key\": \"BUYERTEST-XXXXXXXX-XXXXXXXX-XXXXXXXX\"\n}"
								}
							]
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				},
				{
					"name": "Platforms & Marketplaces - Internal",
					"item": [
						{
							"name": "Enable Additional Services",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									},
									{
										"key": "Accept",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"vas_payme_id\": \"VASLDEMO-VASLDEMO-VASLDEMO-1234567\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/vas-enable",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"vas-enable"
									]
								},
								"description": "Enable additional services for a seller"
							},
							"response": [
								{
									"name": "Successful Response",
									"originalRequest": {
										"method": "POST",
										"header": [],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"vas_payme_id\": \"VASLDEMO-VASLDEMO-VASLDEMO-1234567\"\n}"
										},
										"url": {
											"raw": ""
										}
									},
									"status": "OK",
									"code": 200,
									"_postman_previewlanguage": "json",
									"header": [
										{
											"key": "Content-Type",
											"value": "application/json"
										}
									],
									"cookie": [],
									"body": "{\n  \"status_code\": 0,\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"vas_payme_id\": \"VASLDEMO-VASLDEMO-VASLDEMO-1234567\",\n  \"vas_description\": \"שירותי מקדמה (זיכוי מהיר ו\\\\או ניכוי)\",\n  \"vas_type\": \"Settlements\",\n  \"vas_name\": null,\n  \"vas_api_key\": null,\n  \"vas_guid\": \"VASLDEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"vas_is_active\": true,\n  \"vas_payer_type\": 2,\n  \"vas_price_currency\": \"ILS\",\n  \"vas_price_setup_fixed\": 0,\n  \"vas_price_periodic_fixed\": 0,\n  \"vas_price_periodic_variable\": \"0.00\",\n  \"vas_price_usage_fixed\": 0,\n  \"vas_price_usage_variable\": \"0.00\",\n  \"vas_market_fee\": null,\n  \"vas_period\": 1,\n  \"vas_data\": [{}]\n}"
								}
							]
						},
						{
							"name": "Disable Additional Services",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									},
									{
										"key": "Accept",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"vas_payme_id\": \"VASLDEMO-VASLDEMO-VASLDEMO-1234567\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/vas-disable",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"vas-disable"
									]
								},
								"description": "Disable additional services for a seller"
							},
							"response": [
								{
									"name": "Successful Response",
									"originalRequest": {
										"method": "POST",
										"header": [],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"vas_payme_id\": \"VASLDEMO-VASLDEMO-VASLDEMO-1234567\"\n}"
										},
										"url": {
											"raw": ""
										}
									},
									"status": "OK",
									"code": 200,
									"_postman_previewlanguage": "json",
									"header": [
										{
											"key": "Content-Type",
											"value": "application/json"
										}
									],
									"cookie": [],
									"body": "{\n  \"status_code\": 0,\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"vas_payme_id\": \"VASLDEMO-VASLDEMO-VASLDEMO-1234567\",\n  \"vas_description\": \"שירותי מקדמה (זיכוי מהיר ו\\\\או ניכוי)\",\n  \"vas_type\": \"Settlements\",\n  \"vas_name\": null,\n  \"vas_api_key\": null,\n  \"vas_guid\": \"VASLDEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"vas_is_active\": false,\n  \"vas_payer_type\": 2,\n  \"vas_price_currency\": \"ILS\",\n  \"vas_price_setup_fixed\": 0,\n  \"vas_price_periodic_fixed\": 0,\n  \"vas_price_periodic_variable\": \"0.00\",\n  \"vas_price_usage_fixed\": 0,\n  \"vas_price_usage_variable\": \"0.00\",\n  \"vas_market_fee\": null,\n  \"vas_period\": 1,\n  \"vas_data\": [{}]\n}"
								}
							]
						}
					],
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				}
			]
		},
		{
			"name": "Value Added Services",
			"item": [
				{
					"name": "Generate a Sale with 3D Secure",
					"item": [
						{
							"name": "Generate Sale with 3D Secure",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									},
									{
										"key": "Accept",
										"value": "application/json"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sale_price\": 10000,\n  \"currency\": \"USD\",\n  \"product_name\": \"Smartphone\",\n  \"transaction_id\": \"12345\",\n  \"installments\": \"1\",\n  \"market_fee\": 2.5,\n  \"sale_send_notifcation\": true,\n  \"sale_callback_url\": \"{{sale_callback_url}}\",\n  \"sale_email\": \"duckshop@example.com\",\n  \"sale_return_url\": \"{{sale_return_url}}\",\n  \"sale_mobile\": \"123456789\",\n  \"sale_name\": \"John\",\n  \"capture_buyer\": \"0\",\n  \"buyer_key\": \"BUYERXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"buyer_perform_validation\": true,\n  \"sale_payment_method\": \"credit-card\",\n  \"layout\": \"dynamic\",\n  \"language\": \"En\",\n  \"services\": {\n    \"name\": \"3D Secure\",\n    \"settings\": {\n      \"active\": true\n    }\n  }\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/generate-sale",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"generate-sale"
									]
								},
								"description": "Generate a new sale with 3D Secure authentication enabled"
							},
							"response": [
								{
									"name": "Successful Response",
									"originalRequest": {
										"method": "POST",
										"header": [],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"sale_price\": 10000,\n  \"currency\": \"USD\",\n  \"product_name\": \"Smartphone\",\n  \"transaction_id\": \"12345\",\n  \"installments\": \"1\",\n  \"market_fee\": 2.5,\n  \"sale_send_notifcation\": true,\n  \"sale_callback_url\": \"{{sale_callback_url}}\",\n  \"sale_email\": \"duckshop@example.com\",\n  \"sale_return_url\": \"{{sale_return_url}}\",\n  \"sale_mobile\": \"123456789\",\n  \"sale_name\": \"John\",\n  \"capture_buyer\": \"0\",\n  \"buyer_key\": \"BUYERXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"buyer_perform_validation\": true,\n  \"sale_payment_method\": \"credit-card\",\n  \"layout\": \"dynamic\",\n  \"language\": \"En\",\n  \"services\": {\n    \"name\": \"3D Secure\",\n    \"settings\": {\n      \"active\": true\n    }\n  }\n}"
										},
										"url": {
											"raw": ""
										}
									},
									"status": "OK",
									"code": 200,
									"_postman_previewlanguage": "json",
									"header": [
										{
											"key": "Content-Type",
											"value": "application/json"
										}
									],
									"cookie": [],
									"body": "{\n  \"status_code\": 0,\n  \"sale_url\": \"https://preprod.paymeservice.com/sale/generate/XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_id\": \"SALEXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"payme_sale_code\": 12345678,\n  \"price\": 1000,\n  \"transaction_id\": \"12345\",\n  \"currency\": \"ILS\"\n}"
								}
							]
						}
					],
					"description": "StartFragment\n\nThis endpoints enable using our frictionless 3D Secure authentication (version 2.2.0) on each sale.\n\nOur 3DS service provides you the following advantages:\n\n- Enhanced Security - 3DS adds an extra layer of security, reducing fraud risk.\n    \n- Reduced Chargebacks - Liability for fraudulent transactions shifts to the card issuer, minimizing losses for merchants.\n    \n- Increased Customer Confidence: 3DS provides a secure payment experience, boosting customer trust.\n    \n- Better Fraud Detection - 3DS systems employ advanced mechanisms to detect and prevent fraud.\n    \n- Seamless Integration - 3DS service is integrated into existing payment systems and processes.\n    \n\nYou can also get from us 3DS as a service, follow the link for more information - [Standalone 3D Secure service](https://payme.stoplight.io/docs/payments/branches/V1.5/wccaiky7b4hlz-standalone-3-d-secure-service).\n\nEndFragment",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				},
				{
					"name": "Standalone 3D Secure service",
					"item": [
						{
							"name": "Initialize 3DSecure",
							"request": {
								"method": "POST",
								"header": [
									{
										"key": "Content-Type",
										"value": "application/json"
									},
									{
										"key": "Accept",
										"value": "application/json"
									},
									{
										"key": "PayMe-Public-Key",
										"value": "MPLDEMO-MPLDEMO-MPLDEMO-MPLDEMO",
										"description": "Merchant's public key"
									}
								],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payment\": {\n    \"method\": \"credit-card\",\n    \"card_number\": \"411111******11111\",\n    \"card_expiry\": \"1223\"\n  },\n  \"customer\": {\n    \"name\": \"John Johnny\",\n    \"email\": \"check@test.com\",\n    \"phone\": \"+972503123123\",\n    \"zip_code\": \"837592375\",\n    \"social_id\": \"123456782\"\n  },\n  \"meta_data_jwt\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImN0eSI6Impzb24ifQ.eyJpYXQiOjE2NjU2NTExODMsIm5iZiI6MTY2NTY1MTE4MywiZXhwIjoxNjY1NjU0NzgzLCJqdGkiOiJjNjMyYTczZC1mNjhiLTRhNzAtOGQ0ZS01ZjRhN2U3MDM0M2YiLCJkYXRhIjp7ImlwIjoiMTQ3LjIzNS43My43MCIsImFjY2VwdCI6IipcLyoiLCJqYXZhRW5hYmxlZCI6ZmFsc2UsImphdmFTY3JpcHRFbmFibGVkIjp0cnVlLCJsYW5ndWFnZSI6ImVuLVVTIiwiY29sb3JEZXB0aCI6MjQsInNjcmVlbiI6eyJoZWlnaHQiOjg2NCwid2lkdGgiOjE1MzZ9LCJ0aW1lem9uZSI6LTE4MCwidXNlckFnZW50IjoibW96aWxsYVwvNS4wICh3aW5kb3dzIG50IDEwLjA7IHdpbjY0OyB4NjQpIGFwcGxld2Via2l0XC81MzcuMzYgKGtodG1sLCBsaWtlIGdlY2tvKSBjaHJvbWVcLzEwNi4wLjAuMCBzYWZhcmlcLzUzNy4zNiJ9fQ.LoOCGeVAPB1tN8No6y8ruohHaW9ZK1qVnrYek8vSwKZM_fzurku_48u4svCPVTgVxliHViFlfpJ0HdwbZXf1THZVivj0_S7rONtIflOPyNSftk8dLiYZh-wpY8pkAkfMk9MgsQ4rbGEVsAiH4w9Dj5ArZmzEUOO8l1uxI1fX9W67RxG_MhTeq4lRTiA6DHNoiR78H_FipZrIRvQ6cd8CNHteRYZ2j5GWw2l-uLa0e5Vui6oqY9jkmbikv31-aCBCnEL8Feq86qm0nVEOaaAts3My4YnOSRV7ncoWTXozUhuaCiW2pTpAvK9QmBytduWQSkY4WePujwSTr-JdyfwpbA\"\n}"
								},
								"url": {
									"raw": "https://{{env}}.payme.io/api/sales/{{payme_sale_id}}/3ds",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"sales",
										"{{payme_sale_id}}",
										"3ds"
									]
								},
								"description": "Initialize 3DSecure authentication for a sale"
							},
							"response": [
								{
									"name": "Successful Response",
									"originalRequest": {
										"method": "POST",
										"header": [],
										"body": {
											"mode": "raw",
											"raw": "{\n  \"payment\": {\n    \"method\": \"credit-card\",\n    \"card_number\": \"411111******11111\",\n    \"card_expiry\": \"1223\"\n  },\n  \"customer\": {\n    \"name\": \"John Johnny\",\n    \"email\": \"check@test.com\",\n    \"phone\": \"+972503123123\",\n    \"zip_code\": \"837592375\",\n    \"social_id\": \"123456782\"\n  },\n  \"meta_data_jwt\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImN0eSI6Impzb24ifQ.eyJpYXQiOjE2NjU2NTExODMsIm5iZiI6MTY2NTY1MTE4MywiZXhwIjoxNjY1NjU0NzgzLCJqdGkiOiJjNjMyYTczZC1mNjhiLTRhNzAtOGQ0ZS01ZjRhN2U3MDM0M2YiLCJkYXRhIjp7ImlwIjoiMTQ3LjIzNS43My43MCIsImFjY2VwdCI6IipcLyoiLCJqYXZhRW5hYmxlZCI6ZmFsc2UsImphdmFTY3JpcHRFbmFibGVkIjp0cnVlLCJsYW5ndWFnZSI6ImVuLVVTIiwiY29sb3JEZXB0aCI6MjQsInNjcmVlbiI6eyJoZWlnaHQiOjg2NCwid2lkdGgiOjE1MzZ9LCJ0aW1lem9uZSI6LTE4MCwidXNlckFnZW50IjoibW96aWxsYVwvNS4wICh3aW5kb3dzIG50IDEwLjA7IHdpbjY0OyB4NjQpIGFwcGxld2Via2l0XC81MzcuMzYgKGtodG1sLCBsaWtlIGdlY2tvKSBjaHJvbWVcLzEwNi4wLjAuMCBzYWZhcmlcLzUzNy4zNiJ9fQ.LoOCGeVAPB1tN8No6y8ruohHaW9ZK1qVnrYek8vSwKZM_fzurku_48u4svCPVTgVxliHViFlfpJ0HdwbZXf1THZVivj0_S7rONtIflOPyNSftk8dLiYZh-wpY8pkAkfMk9MgsQ4rbGEVsAiH4w9Dj5ArZmzEUOO8l1uxI1fX9W67RxG_MhTeq4lRTiA6DHNoiR78H_FipZrIRvQ6cd8CNHteRYZ2j5GWw2l-uLa0e5Vui6oqY9jkmbikv31-aCBCnEL8Feq86qm0nVEOaaAts3My4YnOSRV7ncoWTXozUhuaCiW2pTpAvK9QmBytduWQSkY4WePujwSTr-JdyfwpbA\"\n}"
										},
										"url": {
											"raw": ""
										}
									},
									"status": "OK",
									"code": 200,
									"_postman_previewlanguage": "json",
									"header": [
										{
											"key": "Content-Type",
											"value": "application/json"
										}
									],
									"cookie": [],
									"body": "{\n  \"status_code\": 0,\n  \"status_message\": \"Generating validation page, please wait\",\n  \"redirect_url\": \"https://sandbox.paymeservice.com/3ds/redirect/{{sale payme id}}?pa={{CODE}}\"\n}"
								}
							]
						},
						{
							"name": "Resolve 3DS Secured Hash",
							"request": {
								"method": "GET",
								"header": [
									{
										"key": "Accept",
										"value": "application/json"
									},
									{
										"key": "PayMe-Merchant-Key",
										"value": "MPL1585-FAIKE8234-63IHEFSB-ZQV9UAUX",
										"description": "The MPL of the seller"
									}
								],
								"url": {
									"raw": "https://{{env}}.payme.io/api/sales/{{payme_sale_id}}/3ds/hash",
									"protocol": "https",
									"host": [
										"{{env}}",
										"payme",
										"io"
									],
									"path": [
										"api",
										"sales",
										"{{payme_sale_id}}",
										"3ds",
										"hash"
									]
								},
								"description": "Resolve the secured hash for 3DS authentication"
							},
							"response": [
								{
									"name": "Successful Response",
									"originalRequest": {
										"method": "GET",
										"header": [],
										"url": {
											"raw": ""
										}
									},
									"status": "OK",
									"code": 200,
									"_postman_previewlanguage": "json",
									"header": [
										{
											"key": "Content-Type",
											"value": "application/json"
										}
									],
									"cookie": [],
									"body": "{\n  \"status_code\": 0,\n  \"payme_sale_id\": \"SALE1587-XXXXXXXX-XXXXXXXX-AJJTULHT\"\n}"
								}
							]
						}
					],
					"description": "You can utilize the standalone 3D Secure service provided by PayMe to perform 3D Secure authentication at a specific stage within your transaction workflow.\n\nTypically, when a customer makes a purchase and you attempt to charge their payment card, they are prompted to complete 3D Secure authentication. However, there may be instances where you prefer to process 3D Secure as a separate step.\n\nFor more information, go to the [3D Secure as a Service Guide](https://payme.stoplight.io/docs/guides/branches/main/6p1po8mjtyrlz-3-d-secure-as-a-service).\n\n#### [Process flow](https://payme.stoplight.io/docs/payments/wccaiky7b4hlz-standalone-3-d-secure-service#process-flow)\n\n1 - Please follow the instructions that can be found [here](https://payme.stoplight.io/docs/guides/branches/main/gsok0tstibqmz-hosted-fields-jsapi-guide#3ds-integration-using-js-api).\n\n2 - In order to use the 3DS service, you'll need to implement our library (as described in step 1 above) in your checkout page and collect the user data.\n\n3 - [<code>Generate sale</code>](https://payme.stoplight.io/docs/payments/branches/V1.5/5cf5e33e66c5b-generate-sale-with-3-d-secure) in order to get a `payme_sale_id`.\n\n4 - Send the meta data to us as a part of the [<code>sales/{payme_sale_id}/3ds request</code>](https://payme.stoplight.io/docs/payments/branches/V1.5/9eb6097d578c2-initialize-3-d-secure-request).\n\n5 - The 3DS service may prompt the cardholder to provide additional information or perform an action to validate their identity (a challenge).  \n**5.a. - In case of a frictionless process (without a challenge)** - You will receive a hash in the response.  \n**5.b. - In case of a challenge** - You will receive a callback with a link to the issuer website, with the result of the authentication process.\n\n6 - Send the hash you received in the response/callback (in case there was a challange) as part of the [Resolve Secured Hash](https://payme.stoplight.io/docs/payments/branches/V1.5/410e3168d1ad5-resolve-secured-hash) API request to get the 3DS parameters (`xid`, `eci`, `cavv`).",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					]
				}
			],
			"description": "At PayMe, We go beyond traditional financial solutions to offer a comprehensive suite of value-added services. These services are designed to enhance our clients' financial experiences and empower them with the tools they need for success. From the creation of invoices and security services to seamless integration with third-party platforms, our value-added services cater to the diverse needs of your business."
		},
		{
			"name": "Invoices",
			"item": [
				{
					"name": "Create Document",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Accept",
								"value": "application/json"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"doc_type\": 400,\n  \"doc_title\": \"document-title\",\n  \"doc_comments\": \"document-comment\",\n  \"buyer_name\": \"buyer's-name\",\n  \"due_date\": \"2023-06-20T00:00:00.000Z\",\n  \"pay_date\": \"2023-06-20T00:00:00.000Z\",\n  \"doc_date\": \"2023-06-20T00:00:00.000Z\",\n  \"items\": [\n    {\n      \"description\": \"product/service-description\",\n      \"unit_price\": 33,\n      \"vat_exempt\": false,\n      \"quantity\": 1,\n      \"unit_price_with_vat\": 33,\n      \"currency\": \"ILS\",\n      \"exchange_rate\": 1\n    }\n  ],\n  \"currency\": \"ILS\",\n  \"exchange_rate\": 1,\n  \"vat_rate\": 0,\n  \"total_excluding_vat\": 33,\n  \"discount\": 0,\n  \"total_sum_after_discount\": 33,\n  \"total_sum_including_vat\": 33,\n  \"total_paid\": 33,\n  \"total_vat\": 0,\n  \"total_paid_including_vat\": 33,\n  \"language\": \"he\",\n  \"credit_card\": {\n    \"sum\": 33,\n    \"installments\": 1,\n    \"first_payment\": 33,\n    \"number\": \"45************80\",\n    \"type\": \"Visa\",\n    \"exp_year\": \"2**4\",\n    \"exp_month\": \"07\",\n    \"buyer_social_id\": \"20*****6\",\n    \"buyer_name\": \"buyer's-name\",\n    \"auth_number\": \"0*****3\"\n  }\n}"
						},
						"url": {
							"raw": "https://{{env}}.payme.io/api/documents",
							"protocol": "https",
							"host": [
								"{{env}}",
								"payme",
								"io"
							],
							"path": [
								"api",
								"documents"
							]
						},
						"description": "Generate a document such as invoice or receipt"
					},
					"response": [
						{
							"name": "Successful Response",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"doc_type\": 400,\n  \"doc_title\": \"document-title\",\n  \"doc_comments\": \"document-comment\",\n  \"buyer_name\": \"buyer's-name\",\n  \"due_date\": \"2023-06-20T00:00:00.000Z\",\n  \"pay_date\": \"2023-06-20T00:00:00.000Z\",\n  \"doc_date\": \"2023-06-20T00:00:00.000Z\",\n  \"items\": [\n    {\n      \"description\": \"product/service-description\",\n      \"unit_price\": 33,\n      \"vat_exempt\": false,\n      \"quantity\": 1,\n      \"unit_price_with_vat\": 33,\n      \"currency\": \"ILS\",\n      \"exchange_rate\": 1\n    }\n  ],\n  \"currency\": \"ILS\",\n  \"exchange_rate\": 1,\n  \"vat_rate\": 0,\n  \"total_excluding_vat\": 33,\n  \"discount\": 0,\n  \"total_sum_after_discount\": 33,\n  \"total_sum_including_vat\": 33,\n  \"total_paid\": 33,\n  \"total_vat\": 0,\n  \"total_paid_including_vat\": 33,\n  \"language\": \"he\",\n  \"credit_card\": {\n    \"sum\": 33,\n    \"installments\": 1,\n    \"first_payment\": 33,\n    \"number\": \"45************80\",\n    \"type\": \"Visa\",\n    \"exp_year\": \"2**4\",\n    \"exp_month\": \"07\",\n    \"buyer_social_id\": \"20*****6\",\n    \"buyer_name\": \"buyer's-name\",\n    \"auth_number\": \"0*****3\"\n  }\n}"
								},
								"url": {
									"raw": ""
								}
							},
							"status": "OK",
							"code": 200,
							"_postman_previewlanguage": "json",
							"header": [
								{
									"key": "Content-Type",
									"value": "application/json"
								}
							],
							"cookie": [],
							"body": "{\n  \"status_code\": 0,\n  \"doc_id\": \"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\",\n  \"doc_url\": \"https://document.url.com/documents/ID\"\n}"
						}
					]
				},
				{
					"name": "Get Document By ID",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "PayMe-Merchant-Key",
								"value": "DEMOMPL-DEMOMPL-DEMOMPL-DEMOMPL",
								"description": "Seller's MPL"
							}
						],
						"url": {
							"raw": "https://{{env}}.payme.io/api/documents/{{document_id}}",
							"protocol": "https",
							"host": [
								"{{env}}",
								"payme",
								"io"
							],
							"path": [
								"api",
								"documents",
								"{{document_id}}"
							]
						},
						"description": "Retrieve a generated document by its ID"
					},
					"response": []
				},
				{
					"name": "Query Existing Documents",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "PayMe-Merchant-Key",
								"value": "MPL15991-38967CJU-GSBK5E1G-XSZ1GZXU",
								"description": "Seller's MPL"
							}
						],
						"url": {
							"raw": "https://{{env}}.payme.io/api/documents?page=0&limit=5&field=createdAt&sort=desc",
							"protocol": "https",
							"host": [
								"{{env}}",
								"payme",
								"io"
							],
							"path": [
								"api",
								"documents"
							],
							"query": [
								{
									"key": "page",
									"value": "0",
									"description": "Page number"
								},
								{
									"key": "limit",
									"value": "5",
									"description": "Number of documents per page"
								},
								{
									"key": "field",
									"value": "createdAt",
									"description": "Field to sort by"
								},
								{
									"key": "sort",
									"value": "desc",
									"description": "Sort order (desc/asc)"
								}
							]
						},
						"description": "Query existing documents with pagination and sorting"
					},
					"response": []
				}
			],
			"description": "You can use our Invoices API to generate different documents to serve your business needs.\n\n#### [Document types](https://payme.stoplight.io/docs/payments/0a76d2a3e52c3-documents#document-types)\n\nThe documents you can generate can be found in the following guide - [Document Types](https://payme.stoplight.io/docs/guides/xjoh69bnd0h24-document-types)."
		},
		{
			"name": "Reporting and Data",
			"item": [
				{
					"name": "List Sales",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Accept",
								"value": "application/json"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"seller_id\": \"12345\",\n  \"sale_payme_code\": \"12345678\",\n  \"sale_payme_id\": \"SALEXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"sale_created\": \"2016-01-01 15:15:15\",\n  \"sale_created_min\": \"2016-01-01 00:00:00\",\n  \"sale_created_max\": \"2016-01-02 00:00:00\",\n  \"sale_status\": \"completed\",\n  \"sale_price\": 100,\n  \"sale_currency\": \"USD\",\n  \"sale_auth_number\": \"01A2B3C\",\n  \"buyer_card_mask\": \"458045******4580\",\n  \"buyer_card_last_four_digits\": \"4580\",\n  \"buyer_name\": \"First Last\",\n  \"buyer_email\": \"buyer@example.com\",\n  \"buyer_phone\": \"0540000000\",\n  \"buyer_social_id\": \"000000001\",\n  \"buyer_card_is_foreign\": true,\n  \"page_size\": 100,\n  \"page\": 1\n}"
						},
						"url": {
							"raw": "https://{{env}}.payme.io/api/get-sales",
							"protocol": "https",
							"host": [
								"{{env}}",
								"payme",
								"io"
							],
							"path": [
								"api",
								"get-sales"
							]
						},
						"description": "Retrieve sales data with filtering and pagination"
					},
					"response": [
						{
							"name": "Successful Response",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"page_size\": 100,\n  \"page\": 1\n}"
								},
								"url": {
									"raw": ""
								}
							},
							"status": "OK",
							"code": 200,
							"_postman_previewlanguage": "json",
							"header": [
								{
									"key": "Content-Type",
									"value": "application/json"
								}
							],
							"cookie": [],
							"body": "{\n  \"items_count\": 10,\n  \"items\": [\n    {\n      \"seller_payme_id\": \"{{seller_payme_id}}\",\n      \"seller_id\": \"12345\",\n      \"sale_payme_id\": \"SALEXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n      \"sale_payme_code\": \"12345678\",\n      \"transaction_id\": \"TRANXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n      \"sale_created\": \"2016-01-01 15:15:15\",\n      \"sale_status\": \"completed\",\n      \"sale_currency\": \"ILS\",\n      \"sale_price\": 100,\n      \"sale_price_after_fees\": 100,\n      \"sale_description\": \"SaaS service\",\n      \"sale_installments\": 1,\n      \"sale_vat\": \"0.17\",\n      \"sale_paid_date\": \"2016-01-01 15:15:15\",\n      \"sale_auth_number\": \"01A2B3C\",\n      \"sale_release_date\": \"2016-01-01 15:15:15\",\n      \"sale_fees\": {\n        \"sale_processing_fee\": \"2.05\",\n        \"sale_processing_charge\": \"2.05\",\n        \"sale_discount_fee\": \"0.05\",\n        \"sale_rapid_settlement_fee\": \"0.06\",\n        \"sale_market_fee\": \"0.5\"\n      },\n      \"sale_buyer_details\": {\n        \"buyer_card_mask\": \"458045******4580\",\n        \"buyer_card_expiry\": \"06/25\",\n        \"buyer_card_brand\": \"Visa\",\n        \"buyer_card_is_foreign\": true,\n        \"buyer_name\": \"John James\",\n        \"buyer_email\": \"buyer@buyers.com\",\n        \"buyer_phone\": \"+972 05XXXXXXX\",\n        \"buyer_social_id\": \"999999999\"\n      },\n      \"sale_invoices\": [{}]\n    }\n  ],\n  \"status_code\": 0\n}"
						}
					]
				},
				{
					"name": "List Transactions",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Accept",
								"value": "application/json"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"transaction_type\": 1,\n  \"transaction_status\": \"pending\",\n  \"sale_status\": \"completed\",\n  \"sale_currency\": \"ILS\",\n  \"sale_payment_method\": \"credit-card\",\n  \"transaction_created_min\": \"2019-01-01 00:00:00\",\n  \"transaction_created_max\": \"2019-01-01 00:00:00\",\n  \"transaction_created_at\": \"2019-01-01 00:00:00\",\n  \"transaction_id\": \"12345\",\n  \"payme_transaction_id\": \"TRANXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"transaction_price\": 100,\n  \"sale_price\": 100,\n  \"sale_auth_number\": \"01A2B3C\",\n  \"buyer_card_mask\": \"458045******4580\",\n  \"buyer_name\": \"John Doe\",\n  \"buyer_phone\": \"+972 05XXXXXXX\",\n  \"buyer_social_id\": \"999999999\",\n  \"buyer_card_is_foreign\": true,\n  \"buyer_card_last_four_digits\": \"4580\",\n  \"sale_is_3ds\": false,\n  \"transaction_is_matched\": true,\n  \"page_size\": 100,\n  \"page\": 1\n}"
						},
						"url": {
							"raw": "https://{{env}}.payme.io/api/get-transactions",
							"protocol": "https",
							"host": [
								"{{env}}",
								"payme",
								"io"
							],
							"path": [
								"api",
								"get-transactions"
							]
						},
						"description": "Retrieve transaction data with filtering and pagination"
					},
					"response": [
						{
							"name": "Successful Response",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"page_size\": 100,\n  \"page\": 1\n}"
								},
								"url": {
									"raw": ""
								}
							},
							"status": "OK",
							"code": 200,
							"_postman_previewlanguage": "json",
							"header": [
								{
									"key": "Content-Type",
									"value": "application/json"
								}
							],
							"cookie": [],
							"body": "{\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"seller_id\": 12345,\n  \"sale_payme_id\": \"SALEXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"sale_payme_code\": 12345678,\n  \"transaction_id\": \"12345\",\n  \"payme_transaction_id\": \"TRANXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"transaction_created_at\": \"2016-01-01 15:15:15\",\n  \"sale_type\": 1,\n  \"sale_status\": \"completed\",\n  \"transaction_status\": \"pending\",\n  \"transaction_type\": 1,\n  \"sale_currency\": \"ILS\",\n  \"sale_description\": \"SaaS service\",\n  \"sale_installments\": 1,\n  \"sale_payment_method\": \"credit-card\",\n  \"transaction_price\": 100,\n  \"transaction_price_after_fees\": \"100\",\n  \"sale_vat\": \"0.17\",\n  \"sale_auth_number\": \"01A2B3C\",\n  \"transaction_release_date\": \"2016-01-01 15:15:15\",\n  \"transaction_voucher\": \"116790\",\n  \"transaction_reference_number\": \"123456\",\n  \"transaction_action\": \"Debit\",\n  \"transaction_first_payment\": 100,\n  \"transaction_periodical_payment\": 0,\n  \"transaction_arn\": \"12345678912345678912345\",\n  \"transaction_acquirer\": \"Isracard\",\n  \"transaction_discounter\": \"PayMe\",\n  \"transaction_error_code\": 20000,\n  \"transaction_error_text\": \"Permitted transaction\",\n  \"transaction_is_matched\": true,\n  \"transaction_match_statuses\": [],\n  \"transaction_is_canceled\": false,\n  \"sale_is_3ds\": false,\n  \"sale_fees\": {\n    \"sale_processing_fee\": \"1.5\",\n    \"sale_processing_fee_total\": 3,\n    \"sale_processing_charge\": \"1.5\",\n    \"sale_discount_fee\": \"1.5\",\n    \"sale_discount_fee_total\": 3,\n    \"sale_rapid_settlement_fee\": \"1.5\",\n    \"sale_rapid_settlement_fee_total\": 3,\n    \"sale_annual_interest_rate\": \"4.5\",\n    \"sale_market_fee\": \"30.00\",\n    \"sale_market_fee_total\": 30\n  },\n  \"sale_buyer_details\": {\n    \"buyer_card_mask\": \"458045******4580\",\n    \"buyer_card_expiry\": \"06/25\",\n    \"buyer_card_brand\": \"Visa\",\n    \"buyer_card_is_foreign\": true,\n    \"buyer_name\": \"John Doe\",\n    \"buyer_email\": \"buyer@buyers.com\",\n    \"buyer_phone\": \"+972 05XXXXXXX\",\n    \"buyer_social_id\": \"999999999\"\n  },\n  \"transaction_invoice_url\": \"https://payme.io/invoice\",\n  \"transaction_invoice_doc_number\": \"12345\"\n}"
						}
					]
				},
				{
					"name": "List Subscriptions",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Accept",
								"value": "application/json"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"seller_id\": \"12345\",\n  \"sub_payme_code\": \"1234\",\n  \"sub_payme_id\": \"SALEXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"sub_created\": \"2016-01-01 15:15:15\",\n  \"sub_created_min\": \"2016-01-01 00:00:00\",\n  \"sub_created_max\": \"2016-01-02 00:00:00\",\n  \"sub_status\": \"1\",\n  \"sub_iteration_type\": 1,\n  \"sub_price\": 5000,\n  \"sub_currency\": \"USD\",\n  \"sub_iterations\": 1,\n  \"sub_start_date\": \"2016-01-01 00:00:00\",\n  \"sub_paid\": true,\n  \"page_size\": 100,\n  \"page\": 1\n}"
						},
						"url": {
							"raw": "https://{{env}}.payme.io/api/get-subscriptions",
							"protocol": "https",
							"host": [
								"{{env}}",
								"payme",
								"io"
							],
							"path": [
								"api",
								"get-subscriptions"
							]
						},
						"description": "Retrieve subscription data with filtering and pagination"
					},
					"response": [
						{
							"name": "Successful Response",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"{{seller_payme_id}}\",\n  \"page_size\": 100,\n  \"page\": 1\n}"
								},
								"url": {
									"raw": ""
								}
							},
							"status": "OK",
							"code": 200,
							"_postman_previewlanguage": "json",
							"header": [
								{
									"key": "Content-Type",
									"value": "application/json"
								}
							],
							"cookie": [],
							"body": "{\n  \"items_count\": 1,\n  \"items\": [\n    {\n      \"seller_payme_id\": \"{{seller_payme_id}}\",\n      \"seller_id\": \"12345\",\n      \"sub_payme_id\": \"XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n      \"payme_sub_code\": 1,\n      \"sub_created\": \"2016-01-01 15:15:15\",\n      \"sub_start_date\": \"2016-01-01 15:15:15\",\n      \"sub_status\": \"1\",\n      \"sub_iteration_type\": 1,\n      \"sub_price\": 5000,\n      \"sub_description\": \"30 days Subscription for X service\",\n      \"sub_iterations\": \"4\",\n      \"sub_iterations_completed\": \"3\",\n      \"sub_iterations_left\": \"2\",\n      \"sub_payment_date\": \"2016-01-01 15:15:15\",\n      \"sub_error_text\": \"Failed, pending automatic retry\",\n      \"sub_currency\": \"USD\",\n      \"sub_paid\": true,\n      \"sub_buyer_details\": {\n        \"buyer_card_mask\": \"458045******4580\",\n        \"buyer_name\": \"John James\",\n        \"buyer_email\": \"Paymeservice@payme.com\",\n        \"buyer_phone\": \"+972 05XXXXXXX\",\n        \"buyer_social_id\": \"999999999\"\n      }\n    }\n  ],\n  \"status_code\": 0\n}"
						}
					]
				},
				{
					"name": "List Sellers",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Accept",
								"value": "application/json"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"MPL1DEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"seller_created_max\": \"2016-01-02 00:00:00\",\n  \"seller_created_min\": \"2016-01-01 00:00:00\",\n  \"seller_id\": \"12345\",\n  \"seller_first_name\": \"John\",\n  \"seller_last_name\": \"Doe\",\n  \"seller_social_id\": \"999999999\",\n  \"seller_email\": \"personal@example.com\",\n  \"seller_phone\": \"+9720540123456\",\n  \"seller_contact_email\": \"contact@example.com\",\n  \"seller_contact_phone\": \"031234567\",\n  \"seller_inc_code\": \"123456\",\n  \"selelr_merchant_name\": \"Store name\",\n  \"market_fee\": \"30.00\",\n  \"seller_active\": true,\n  \"seller_approved\": true,\n  \"page_size\": 100,\n  \"page\": 1\n}"
						},
						"url": {
							"raw": "https://{{env}}.payme.io/api/get-sellers",
							"protocol": "https",
							"host": [
								"{{env}}",
								"payme",
								"io"
							],
							"path": [
								"api",
								"get-sellers"
							]
						},
						"description": "Retrieve seller data with filtering and pagination"
					},
					"response": [
						{
							"name": "Successful Response",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"MPL1DEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"page_size\": 100,\n  \"page\": 1\n}"
								},
								"url": {
									"raw": ""
								}
							},
							"status": "OK",
							"code": 200,
							"_postman_previewlanguage": "json",
							"header": [
								{
									"key": "Content-Type",
									"value": "application/json"
								}
							],
							"cookie": [],
							"body": "{\n  \"items_count\": 1,\n  \"items\": [\n    {\n      \"seller_payme_id\": \"XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n      \"seller_id\": \"12345\",\n      \"seller_created\": \"2016-01-01 15:15:15\",\n      \"seller_active\": true,\n      \"seller_approved\": true,\n      \"seller_approved_date\": \"2016-01-02 00:00:00\",\n      \"seller_is_paid_directly\": true,\n      \"seller_is_discount\": true,\n      \"seller_withdrawal_plan\": 3,\n      \"seller_withdrawal_date\": null,\n      \"seller_personal_details\": {\n        \"seller_first_name\": \"First\",\n        \"seller_last_name\": \"Last\",\n        \"seller_social_id\": \"999999999\",\n        \"seller_birthdate\": \"2016-01-01 15:15:15\",\n        \"seller_gender\": \"1\",\n        \"seller_email\": \"example@domain.com\",\n        \"seller_phone\": \"+972509999999\"\n      },\n      \"seller_business_details\": {\n        \"seller_inc\": {\n          \"Available Values\": 0\n        },\n        \"seller_inc_code\": \"123456\",\n        \"seller_merchant_name\": \"Merchant name\",\n        \"seller_site_url\": \"https://www.example.com\",\n        \"seller_description\": \"Business brief explanation\",\n        \"seller_retail_type\": \"1\",\n        \"seller_contact_email\": \"example@domain.com\",\n        \"seller_contact_phone\": \"+9720509999999\",\n        \"seller_bank_account_code\": \"10\",\n        \"seller_bank_account_branch\": \"881\",\n        \"seller_bank_account_number\": \"9999999\"\n      },\n      \"seller_address\": {\n        \"seller_address_city\": \"Tel Aviv\",\n        \"seller_address_street\": \"Rothchild\",\n        \"seller_address_street_number\": \"150\",\n        \"seller_address_country\": \"IL\"\n      },\n      \"seller_fees\": {\n        \"fee_market_fee\": \"0.00\",\n        \"fee_default_processing_fee\": \"0.00\",\n        \"fee_default_processing_charge\": \"0.000000000000000000\",\n        \"fee_default_discount_fee\": \"0.00\",\n        \"fee_foreign_processing_fee\": \"0.00\",\n        \"fee_foreign_processing_charge\": \"0.000000000000000000\",\n        \"fee_forcurr_processing_charge\": \"0.000000000000000000\"\n      },\n      \"seller_currencies\": [],\n      \"seller_wallets\": {\n        \"ILS\": {\n          \"wallet_currency\": \"ILS\",\n          \"wallet_total\": \"1234\",\n          \"wallet_releasable\": \"1234\"\n        },\n        \"USD\": {\n          \"wallet_currency\": \"USD\",\n          \"wallet_total\": \"1234\",\n          \"wallet_releasable\": \"1234\"\n        }\n      },\n      \"seller_monthly_invoices\": {\n        \"1234\": {\n          \"invoice_reference\": \"2015-12\",\n          \"invoice_created\": \"2016-01-01\",\n          \"invoice_doc_number\": \"1234\",\n          \"invoice_url\": \"PDF_FILE_URL.pdf\",\n          \"invoice_details_url\": \"https://sandbox.paymeservice.com/system/invoice-details-viewer/XXXXXXX\"\n        }\n      }\n    }\n  ],\n  \"status_code\": 0\n}"
						}
					]
				},
				{
					"name": "List Past Withdrawals",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Accept",
								"value": "application/json"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"items_order_by_column\": \"withdrawal_created\",\n  \"items_order_by_direction\": \"desc\",\n  \"seller_payme_id\": \"MPL1DEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"page_size\": 500,\n  \"page\": 1,\n  \"withdrawal_created_min\": \"2021-06-01 00:00:00\",\n  \"withdrawal_created_max\": \"2021-06-29 23:59:59\",\n  \"language\": \"en\"\n}"
						},
						"url": {
							"raw": "https://{{env}}.payme.io/api/get-withdrawals",
							"protocol": "https",
							"host": [
								"{{env}}",
								"payme",
								"io"
							],
							"path": [
								"api",
								"get-withdrawals"
							]
						},
						"description": "Retrieve withdrawal history with filtering and pagination"
					},
					"response": [
						{
							"name": "Successful Response",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"payme_client_key\": \"{{payme_client_key}}\",\n  \"seller_payme_id\": \"MPL1DEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"page_size\": 500,\n  \"page\": 1\n}"
								},
								"url": {
									"raw": ""
								}
							},
							"status": "OK",
							"code": 200,
							"_postman_previewlanguage": "json",
							"header": [
								{
									"key": "Content-Type",
									"value": "application/json"
								}
							],
							"cookie": [],
							"body": "{\n  \"items_count\": 1,\n  \"items\": [\n    {\n      \"seller_payme_id\": \"XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n      \"withdrawal_payme_code\": 12345,\n      \"withdrawal_created\": \"2021-06-15 10:30:00\",\n      \"withdrawal_currency\": \"ILS\",\n      \"withdrawal_total\": 5000,\n      \"withdrawal_description\": \"Bank withdrawal\"\n    }\n  ],\n  \"status_code\": 0\n}"
						}
					]
				},
				{
					"name": "List Future Withdrawals",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Accept",
								"value": "application/json"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"seller_payme_id\": \"MPL1DEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"currency\": \"ILS\",\n  \"page_size\": 100,\n  \"page\": 1\n}"
						},
						"url": {
							"raw": "https://{{env}}.payme.io/api/get-future-withdrawals",
							"protocol": "https",
							"host": [
								"{{env}}",
								"payme",
								"io"
							],
							"path": [
								"api",
								"get-future-withdrawals"
							]
						},
						"description": "Retrieve expected future withdrawals data"
					},
					"response": [
						{
							"name": "Successful Response",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n  \"seller_payme_id\": \"MPL1DEMO-XXXXXXXX-XXXXXXXX-XXXXXXXX\",\n  \"currency\": \"ILS\"\n}"
								},
								"url": {
									"raw": ""
								}
							},
							"status": "OK",
							"code": 200,
							"_postman_previewlanguage": "json",
							"header": [
								{
									"key": "Content-Type",
									"value": "application/json"
								}
							],
							"cookie": [],
							"body": "{\n  \"items_count\": 1,\n  \"items\": [\n    {\n      \"start_time\": 1687774500,\n      \"end_time\": -1,\n      \"created_at\": \"2023-06-20 14:00:20\",\n      \"withdrawable\": 1,\n      \"source\": 1,\n      \"source_text\": \"PayMe\",\n      \"card_brand\": 1,\n      \"card_brand_text\": \"Other\",\n      \"total\": \"156390\",\n      \"withdrawal_payme_code\": \"withdrawal-code\"\n    }\n  ],\n  \"status_code\": 0\n}"
						}
					]
				},
				{
					"name": "List Banks by Country",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									"pm.test(\"Response status code is 200\", function () {",
									"    pm.expect(pm.response.code).to.equal(200);",
									"});",
									"",
									"pm.test(\"Response time is within limits\", function () {",
									"    pm.expect(pm.response.responseTime).to.be.below(1000);",
									"});",
									"",
									"pm.test(\"Response has valid JSON\", function () {",
									"    pm.response.to.have.jsonBody();",
									"});",
									"",
									"pm.test(\"Validate required parameters\", function () {",
									"    const responseData = pm.response.json();",
									"    pm.expect(responseData).to.be.an('object');",
									"});"
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Accept",
								"value": "application/json"
							},
							{
								"key": "PayMe-Partner-Key",
								"value": "asf124415",
								"description": "Your PayMe's Partner Secret Key"
							}
						],
						"url": {
							"raw": "https://{{env}}.payme.io/api/banks/{{country_iso_code}}",
							"protocol": "https",
							"host": [
								"{{env}}",
								"payme",
								"io"
							],
							"path": [
								"api",
								"banks",
								"{{country_iso_code}}"
							]
						},
						"description": "Retrieve list of available banks for a specific country"
					},
					"response": [
						{
							"name": "Successful Response",
							"originalRequest": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": ""
								}
							},
							"status": "OK",
							"code": 200,
							"_postman_previewlanguage": "json",
							"header": [
								{
									"key": "Content-Type",
									"value": "application/json"
								}
							],
							"cookie": [],
							"body": "{\n  \"status_code\": 0,\n  \"items_count\": 10,\n  \"items_per_page\": 10,\n  \"country_code\": \"376\",\n  \"items\": [\n    {\n      \"code\": \"010\",\n      \"local_name\": \"Bank Hapoalim\",\n      \"international_name\": \"Bank Hapoalim\"\n    }\n  ]\n}"
						}
					]
				}
			],
			"description": "Access preconfigured reports to gain insight into essential activities, such as sales, transactions, subscriptions, and balance adjustments.\n\nOur queries APIs enable you to perform various actions related to obtaining data on:\n\n| API | Description |\n| --- | --- |\n| **get-sellers** | Extract data about your sellers |\n| **get-sales** | Extract data on different sales your sellers completed |\n| **get-transactions** | Extract data on transactions your sellers completed |\n| **get-subscriptions** | Extract data on different subscriptions that are currently active/inactive |\n| **get-withdrawals** | Extract data on specific withdrawals yoursellers requested. |"
		}
	],
	"event": [
		{
			"listen": "prerequest",
			"script": {
				"type": "text/javascript",
				"packages": {},
				"exec": [
					""
				]
			}
		},
		{
			"listen": "test",
			"script": {
				"type": "text/javascript",
				"packages": {},
				"exec": [
					""
				]
			}
		}
	],
	"variable": [
		{
			"key": "sale_return_url",
			"value": "",
			"type": "string"
		},
		{
			"key": "sale_callback_url",
			"value": "",
			"type": "string"
		},
		{
			"key": "seller_payme_id",
			"value": "Place your MPL/API Key Here",
			"type": "string"
		},
		{
			"key": "sub_return_url",
			"value": "",
			"type": "string"
		},
		{
			"key": "sub_callback_url",
			"value": "",
			"type": "string"
		},
		{
			"key": "sub_payme_id",
			"value": "",
			"type": "string"
		},
		{
			"key": "payme_client_key",
			"value": "",
			"type": "string"
		}
	]
}