export const ResponsesCodes = {
  101: { value: "-Field is blank in a request" },
  102: { value: "Internal Mapping for ISO not set" },
  103: { value: "ISO message field configuration not found" },
  104: { value: "Response Code not found in ISO message" },
  105: { value: "Problem while creating or parsing ISO Message" },
  201: { value: "Terminal does not exists" },
  202: { value: "Merchant does not exists" },
  203: { value: "Institution does not exists" },
  204: { value: "Card prefix is not belong to corresponding card Type" },
  205: { value: "Card not allowed for this transaction" },
  206: { value: "Negative IP, Customer is not allowed to perform Transaction" },
  207: { value: "Original Transaction not found" },
  208: { value: "Transaction Flow not set for Transaction Type" },
  209: { value: "Terminal status is Deactive, Transaction Declined" },
  210: { value: "Terminal status is Closed, Transaction Declined" },
  211: { value: "Terminal status is Invalid, Transaction Declined" },
  212: { value: "Merchant status is Deactive, Transaction Declined" },
  213: { value: "Merchant status is Closed, Transaction Declined" },
  214: { value: "Merchant status is Invalid, Transaction Declined" },
  215: { value: "Institution status is Deactive, Transaction Declined" },
  216: { value: "Institution status is Closed, Transaction Declined" },
  217: { value: "Institution status is Invalid, Transaction Declined" },
  218: { value: "MOD10 Check Failed" },
  219: { value: "Card Type not supported by Merchant" },
  220: { value: "CVV Check Failed, CVV value not present" },
  221: { value: "AVS Capture Check Failed, Could not find Customer Address" },
  222: {
    value: "Customer Info Check failed, Could not find Customer Information",
  },
  223: { value: "Card expiry date is not greater than current date" },
  224: { value: "Invalid Login Attempts exceeded" },
  225: { value: "Wrong Terminal password, Please Re-Initiate transaction" },
  226: {
    value: "Negative Country, Customer is not allowed to perform Transaction",
  },
  227: { value: "Card type not supported by institution" },
  228: { value: "Multiple captures not allowed" },

  229: {
    value:
      "Original transaction was done by different terminal, relative transaction not allowed for this terminal",
  },
  230: { value: "Instrument Type not supported" },
  231: {
    value: "Card Number does not belong to instrument Type present in Bin",
  },
  232: { value: "Instrument Type is not allowed for given Merchant" },
  233: {
    value: "Recurring instrument Type does not matches with payment method",
  },

  234: {
    value:
      "Card Data does not belong to instrument Type present in Global Instrument Table",
  },
  235: {
    value: "Global Instrument Table does not contain values for given ID",
  },
  237: { value: "Payment Session Timeout" },
  238: { value: "Transaction already initiated" },
  239: { value: "Merchant is inactive" },
  240: { value: "Mada Card Brand not support for recurring transaction" },
  301: { value: "Transaction is not allowed for given Terminal" },
  302: { value: "Transaction is not allowed for given Merchant" },
  303: { value: "Transaction is not allowed for given Institution" },
  304: { value: "Currency not supported for given Terminal" },
  305: { value: "Currency not supported for given Merchant" },
  306: { value: "Currency not supported for given Institution" },

  307: {
    value:
      "Velocity Check Failed, Velocity Profile not found, Level - Terminal",
  },

  308: {
    value:
      "Velocity Check Failed, Velocity Profile not found, Level - Merchant",
  },

  309: {
    value:
      "Velocity Check Failed, Velocity Profile not found, Level - Institution",
  },

  310: {
    value:
      "Transaction Profile not set for Terminal, Unable to check Transaction Profile",
  },

  311: {
    value:
      "Transaction Profile not set for Merchant, Unable to check Transaction Profile",
  },

  312: {
    value:
      "Transaction Profile not set for Institution, Unable to check Transaction Profile",
  },

  313: {
    value:
      "Currency Profile not set for Terminal, Unable to check Currency Profile",
  },

  314: {
    value:
      "Currency Profile not set for Merchant, Unable to check Currency Profile",
  },

  315: {
    value:
      "Currency Profile not set for Institution, Unable to check Currency Profile",
  },

  316: {
    value:
      "Velocity Profile not set for Terminal, Unable to check Velocity Profile",
  },

  317: {
    value:
      "Velocity Profile not set for Merchant, Unable to check Velocity Profile",
  },

  318: {
    value:
      "Velocity Profile not set for Institution, Unable to check Velocity Profile",
  },
  319: { value: "Refund Limit exceeds for Terminal" },
  320: { value: "Refund Limit exceeds for Merchant" },
  321: { value: "Refund Limit exceeds for Institution" },

  322: {
    value:
      "Velocity Check Failed, Transaction amount below Minimum amount allowed, Level - Terminal",
  },

  323: {
    value:
      "Velocity Check Failed, Transaction amount below Minimum amount allowed, Level - Merchant",
  },

  324: {
    value:
      "Velocity Check Failed, Transaction amount below Minimum amount allowed, Level - Institution",
  },

  325: {
    value:
      "Velocity Check Failed, Transaction amount exceeds Maximum amount allowed, Level - Terminal",
  },

  326: {
    value:
      "Velocity Check Failed, Transaction amount exceeds Maximum amount allowed, Level - Merchant",
  },

  327: {
    value:
      "Velocity Check Failed, Transaction amount exceeds Maximum amount allowed, Level - Institution",
  },
  328: { value: "Velocity Check Failed, Level - Terminal" },
  329: { value: "Velocity Check Failed, Level - Merchant" },
  330: { value: "Velocity Check Failed, Level - Institution" },

  331: {
    value:
      "Velocity Check Failed, Transaction exceeds, Daily Total transaction count, Level - Terminal",
  },

  332: {
    value:
      "Velocity Check Failed, Transaction exceeds, Daily Total transaction count, Level - Merchant",
  },

  333: {
    value:
      "Velocity Check Failed, Transaction exceeds, Daily Total transaction count, Level - Institution",
  },

  334: {
    value:
      "Velocity Check Failed, Transaction amount exceeds, Daily Total transaction amount allowed, Level - Terminal",
  },

  335: {
    value:
      "Velocity Check Failed, Transaction amount exceeds, Daily Total transaction amount allowed, Level - Merchant",
  },

  336: {
    value:
      "Velocity Check Failed, Transaction amount exceeds, Daily Total transaction amount allowed, Level - Institution",
  },

  // 337: {
  //   value:
  //     "Velocity Check Failed, Transaction exceeds Total transaction count of this Card, Level - Terminal",
  // },

  338: {
    value:
      "Velocity Check Failed, Transaction exceeds Total transaction count of this Card, Level - Merchant",
  },
  339: { value: "Velocity Check Failed, Transaction" },
  340: { value: "Velocity Check Failed, Transaction" },
  341: { value: "Velocity Check Failed, Transaction" },
  342: { value: "Velocity Check Failed, Transaction" },
  343: { value: "Velocity Check Failed, Transaction" },
  344: { value: "Velocity Check Failed, Transaction" },
  345: { value: "Velocity Check Failed, Transaction" },
  346: { value: "Velocity Check Failed, Transaction Level - Terminal" },
  347: { value: "Velocity Check Failed, Transaction Level - Terminal" },
  348: { value: "Velocity Check Failed, Transaction\nLevel - Merchant" },
  349: { value: "Velocity Check Failed, Transaction\nLevel - Merchant" },
  350: { value: "Velocity Check Failed, Transaction\nLevel - Institution" },
  351: { value: "Velocity Check Failed, Transaction\nLevel - Institution" },

  352: {
    value:
      "Invalid Length Of Beneficiary Bank\nexceeds Total transaction count of this Card, Level - Institution exceeds, Weekly Total transaction count, Level - Terminal exceeds, Monthly Total transaction count, Level - Terminal exceeds, Weekly Total transaction count, Level - Merchant exceeds, Monthly Total transaction count, Level - Merchant exceeds, Weekly Total transaction count, Level - Institution exceeds, Monthly Total transaction count, Level - Institution amount exceeds, Weekly Total transaction amount allowed,\namount exceeds, Monthly Total transaction amount allowed, amount exceeds, Weekly Total transaction amount allowed, amount exceeds, Monthly Total transaction amount allowed, amount exceeds, Weekly Total transaction amount allowed, amount exceeds, Monthly Total transaction amount allowed, Clearing Code",
  },
  353: { value: "Invalid Length Of Beneficiary Bank" },
  354: {
    value: "Sum of beneficiary amount and transaction amount should be same",
  },
  355: { value: "Internal Error occurred while connecting to B2B destination" },
  356: { value: "B2b transaction partially proceed" },
  357: { value: "More than 10 benificiary not supported for Riyadh bank" },
  358: { value: "Token not found in vault" },
  359: { value: "Unable to generate Token,Error occurred" },
  360: { value: "STC PAY not enabled for terminal" },
  361: { value: "STC pay transaction Failed" },
  362: { value: "STC pay dose not support Apple pay transaction" },
  363: {
    value: "Non 3D terminal is not allowed to process STCPAY transaction",
  },
  364: { value: "Transaction failed due to maximum OTP retry limit reach" },
  365: { value: "Error Occurred While Getting Response from STCPAY" },
  371: { value: "Please provide subscription id for recurring request" },
  372: { value: "Subscription id not valid or not available" },
  373: {
    value: "Please provide valid subscription type for recurring request",
  },

  374: {
    value:
      "Recurring transaction date should be greater than or equal to payment start date",
  },
  375: { value: "Failed to cancel Subscription" },
  376: { value: "Subscription already cancelled" },
  377: { value: "Failed to renew Subscription" },

  378: {
    value:
      "No of recurring transactions cannot be less than processed transaction",
  },

  379: {
    value:
      "For this subscriptionid installment/subscription already completed. cannot cancel now",
  },
  380: { value: "Failed To generate schedule for B2B paymentn" },
  381: { value: "Error occurred while parsing B2B XML response" },
  382: { value: "B2B transaction failed" },
  383: { value: "Customer Account Number Is Required" },
  384: { value: "Customer Name Is Not Available In Request" },
  385: {
    value: "Beneficiary Name Is Not Available In Request Or Wrong Length",
  },
  386: { value: "Beneficiary Account Number Is Required Or Wrong Length" },
  387: { value: "Beneficiary BankCode Is Required Or Wrong Length" },
  388: { value: "Invalid Sub Interface Code" },
  389: { value: "B2B transactions Not Enabled For Terminal" },
  390: { value: "Multiple Beneficiary Not Supported For Selected Interface" },
  391: { value: "Beneficiary Not Available in request" },
  392: { value: "Invalid Date Format For Payment Start Date" },
  393: { value: "Sub Interface Not Supported for Selected destination" },
  394: { value: "PG service down" },
  395: { value: "Beneficiary amount is invalid" },
  396: {
    value: "Sum of beneficiary amount and transaction amount should be same",
  },
  397: { value: "B2B Payment start date should be greater than current date" },
  398: { value: "Invalid Payment Details" },
  399: { value: "Invalid Length Of Beneficiary Address" },
  400: { value: "Invalid Length Of Beneficiary Bank Address" },
  401: { value: "Destination is not configured" },
  402: { value: "Can not lookup Destination to send message" },
  403: { value: "Unable to route Message to Destination" },
  404: { value: "Unable to get routing details" },
  405: { value: "Destination does Not Logged on" },
  5001: { value: "Invalid Request or Information wrong" },
  5002: { value: "Error while connecting to Sadad server" },
  5004: { value: "Username or Password not configured for sadad" },
  5005: { value: "Got Sadad Number Successfully" },
  5006: { value: "Sadad Payment details is not available in request" },
  5007: { value: "Sadad Payment details are empty in array" },
  5008: { value: "Invalid Customer Full Name" },
  5009: { value: "Invalid Customer Mobile Number" },
  5010: { value: "Refer to card issuer" },
  5011: { value: "Invalid Customer Email Address" },
  5012: { value: "Invalid Customer Previous Balance" },
  5013: { value: "Customer Tax Number Length Should be 15" },
  5014: { value: "Invalid Issue Date" },
  5015: { value: "Invalid Date Format For Issue Date" },
  5016: { value: "Issue date should be greater than current date" },
  5017: { value: "Invalid Expire Date" },
  5018: { value: "Invalid Date Format For Expire Date" },
  5019: { value: "Expire date should be greater than Issue date" },
  502: { value: "Refer to card issuer, special condition" },
  5020: { value: "In BillItemList quantity should be required" },
  5021: { value: "In BillItemList unitPrice should be required" },
  5022: { value: "Invalid Unit Price" },
  5023: { value: "In BillItemList discount should be required" },
  5024: { value: "Invalid Discount" },
  5025: { value: "In BillItemList discount type should be required" },
  5026: { value: "Discount type should be fixed or perc" },
  5027: { value: "In BillItemList vat should be required" },
  5028: { value: "IsPartialAllowed should be yes or no" },
  5029: { value: "Invalid Customer Id Type" },
  503: { value: "Invalid Merchant or Merchant ID or Inactive Merchant" },
  5030: { value: "Invalid BillItemList" },
  5031: { value: "Invalid Entity Activity Id" },
  5032: { value: "Invalid Mini Partial Amount" },
  5034: { value: "sendLinkMode required" },
  5035: { value: "Invalid sendLinkMode" },
  5036: { value: "Invalid smsLanguage" },
  504: { value: "Pick-up card" },
  505: { value: "Do not honour" },
  506: { value: "Error" },
  507: { value: "Pick-up card, special condition" },
  508: { value: "Honour with identification" },
  509: { value: "Request in progress" },
  510: { value: "Approved, partial" },
  511: { value: "Approved, VIP" },
  512: { value: "Invalid transaction" },
  513: { value: "Invalid amount" },
  514: { value: "Invalid card number" },
  515: { value: "No such issuer" },
  516: { value: "Approved, update track 3" },
  517: { value: "Operator Cancelled" },
  518: { value: "Customer dispute" },
  519: { value: "Re enter transaction" },
  520: { value: "Invalid response" },
  521: { value: "No action taken" },
  522: { value: "Suspected malfunction" },
  523: { value: "Unacceptable transaction fee" },
  524: { value: "File update not supported" },
  525: { value: "Unable to locate record" },
  526: { value: "Duplicate record" },
  527: { value: "File update edit error" },
  528: { value: "File update file locked" },
  530: { value: "File update failed" },
  531: { value: "Bank not supported" },
  532: { value: "Completed partially" },
  533: { value: "Expired card, pick-up" },
  534: { value: "Suspected fraud, pick-up" },
  535: { value: "Contact acquirer, pick-up" },
  536: { value: "Restricted card, pick-up" },
  537: { value: "Call acquirer security, pick-up" },
  538: { value: "PIN tries exceeded, pick-up" },
  539: { value: "No credit account" },
  540: { value: "Function not supported" },
  541: { value: "Lost card (Contact Bank)" },
  542: { value: "No universal account" },
  543: { value: "Stolen card" },
  544: { value: "No investment account" },
  545: { value: "Incorrect OTP value or reference" },
  551: { value: "Not sufficient funds (Client to Contact Bank)" },
  552: { value: "No check account" },
  553: { value: "No savings account" },
  554: { value: "Expired card (Contact Bank)" },
  555: { value: "Incorrect PIN" },
  556: { value: "No card record" },
  557: { value: "Transaction not permitted to cardholder" },
  558: { value: "Transaction not permitted on terminal" },
  559: { value: "Suspected fraud" },
  560: { value: "Contact acquirer" },
  561: { value: "Exceeds withdrawal limit" },
  562: { value: "Restricted card" },
  563: { value: "Security violation" },
  564: { value: "Original amount incorrect" },
  565: { value: "Exceeds withdrawal frequency" },
  566: { value: "Call acquirer security" },
  567: { value: "Hard capture" },
  568: { value: "Response received too late" },
  575: { value: "PIN tries exceeded" },
  576: { value: "Approved country club" },
  577: { value: "Intervene, bank approval required" },
  578: { value: "Original transaction could not be found" },
  579: { value: "approved administrative transaction" },
  580: { value: "Approved national negative file hit OK" },
  581: { value: "Approved commercial" },
  582: { value: "No security module" },
  583: { value: "No accounts" },
  584: { value: "No PBF" },
  585: { value: "PBF update error" },
  586: { value: "Invalid authorisation type" },
  587: { value: "Bad Track 2 bank offline" },
  588: { value: "PTLF error" },
  589: { value: "Invalid route service" },
  590: { value: "Cut-off in progress" },
  591: { value: "Issuer or switch inoperative" },
  592: { value: "Routing error" },
  593: { value: "Violation of law" },
  594: { value: "Duplicate transaction" },
  595: { value: "Reconcile error" },
  596: { value: "Communication System malfunction" },
  597: { value: "Communication Error" },
  598: { value: "Exceeds cash limit" },
  599: { value: "Host Response,Please check bank response code" },
  600: { value: "Transaction service down" },
  601: { value: "System Error, Please contact System Admin." },
  602: { value: "System Error,Please try again" },
  603: { value: "Transaction timed out." },
  604: { value: "Invalid Card Number." },
  605: { value: "Invalid CVV." },
  606: { value: "Invalid Track Id." },
  607: { value: "Invalid Terminal Id." },
  608: { value: "Invalid Address." },
  609: { value: "Invalid Terminal Password." },
  610: { value: "Invalid Action Code." },
  611: { value: "Invalid Currency Code." },
  612: { value: "Invalid Transaction Amount." },
  613: { value: "Invalid Transaction Reference." },
  614: { value: "Invalid UserFields." },
  615: { value: "Invalid City." },
  616: { value: "Invalid characters encountered." },
  617: { value: "Invalid Card Expiry Date." },
  618: { value: "Invalid State" },
  619: { value: "Invalid Country" },
  620: { value: "Invalid Cardholder Name." },
  621: { value: "Invaild ZipCode." },
  622: { value: "Invalid IP Address." },
  623: { value: "Invalid Email Address." },
  624: { value: "Transaction cancelled by the user." },
  625: { value: "3D Secure Check Failed, Cannot continue transaction" },
  626: { value: "Invalid CVV,CVV Mandatory." },
  627: {
    value:
      "Capture not allowed, Mismatch in Capture and Original Auth Transaction Amount.",
  },
  628: {
    value: "Transaction has not been Captured/Purchase, Refund not allowed.",
  },
  629: { value: "Refund Amount exceeds the Captured/Purchase Amount." },
  630: { value: "Transaction is Void, Capture not allowed." },
  631: { value: "Transaction has been Captured, Void Auth not allowed." },
  632: { value: "Original Transaction not found." },
  633: { value: "Transaction already Refunded, Duplicate refund not allowed." },
  634: { value: "Transaction is Void, Refund not allowed." },
  635: {
    value: "Transaction has been Captured, Multiple captures not allowed.",
  },
  636: { value: "Transaction has been Voided , Multiple voids not allowed." },
  637: {
    value:
      "A purchase transaction cannot be captured. It should be an Auth transaction.",
  },
  638: { value: "Purchase transaction cannot be Voided." },
  639: {
    value:
      "Invalid Void Transaction, Void and Original Auth Transaction Amount mismatched.",
  },
  640: {
    value:
      "Refund transaction in progress, Cannot process duplicate transaction",
  },
  641: {
    value:
      "Capture transaction in progress, Cannot process duplicate transaction",
  },
  642: {
    value:
      "Void Auth transaction in progress, cannot process duplicate transaction",
  },
  644: { value: "Transaction is fully refunded, refund not allowed" },
  645: { value: "Transaction is chargeback transaction, refund not allowed" },
  646: {
    value:
      "Transaction is chargeback transaction, refund amount exceeds allowed amount",
  },
  647: { value: "Invalid subscription type" },
  648: { value: "Invalid payment type" },
  649: { value: "Invalid payment cycle" },
  650: { value: "Invalid payment start date" },
  651: { value: "Invalid payment days" },
  652: { value: "Invalid payment Method" },
  653: { value: "Terminal not allow for recurring payment" },
  654: { value: "Invalid Recurring Amount" },
  655: { value: "Invalid payment type" },
  656: { value: "Invalid No of recurring payment" },
  657: {
    value:
      "Recurring cycle limit exceeds, cannot set recurringing for more than 2 years",
  },
  658: { value: "Amount 0.00 is not supported for Pre-auth transaction" },
  659: { value: "Request authentication failed" },
  660: { value: "Invalid tran message id or track id" },
  661: { value: "Invalid original action code" },
  662: { value: "Original transaction was done by different terminal" },
  663: { value: "Transaction inquiry failed" },
  664: { value: "Currency Code is not matching with transaction currency" },
  665: { value: "TrackId is not matching with transaction trackid" },
  670: { value: "Transaction has been Refunded, Void Purchase not allowed" },
  671: { value: "Void Purchase not allowed for PreAuth Transaction" },
  672: { value: "Transaction is Purchase, Void Refund not allowed" },
  673: { value: "Transaction is Pre-Auth, Void Refund not allowed" },
  674: { value: "Transaction is Void Purchase, Void Refund not allowed" },
  675: { value: "Transaction is Capture, Void Refund not allowed" },
  676: { value: "Transaction is Void Auth, Void Refund not allowed" },
  677: {
    value:
      "Void Purchase not allowed, Mismatch in Void Purchase and Original Purchase Transaction Amount",
  },
  678: {
    value:
      "Void Refund not allowed, Mismatch in Void Refund and Original Refund Transaction Amount",
  },
  679: { value: "Invalid Payment Data,Apple pay" },
  680: {
    value:
      "Recurring cycle limit exceeds, cannot set recurringing for more than 30 years",
  },
  699: { value: "Transaction timed out from bank" },
  701: { value: "Error while processing ApplePay payment Token request" },
  702: { value: "No Such Payment" },
  703: { value: "Payment Cancelled" },
  704: { value: "Payment Expired" },
  705: { value: "Already Paid" },
  706: { value: "Please complete your Customer Information" },
  707: { value: "Account is not allowed for transfers" },
  708: { value: "Payment information mismatch with the OtpReference" },
  709: {
    value: "Your Account status is not valid to perform this transaction",
  },
  710: { value: "STCPay System Error, please try again" },
  711: { value: "Merchant Not Found" },
  712: { value: "Required StcPaypmtReference" },
  799: { value: "TM time out" },
  901: { value: "Merchant not authorize to perform tokenization request" },
  902: { value: "Tokenization not enabled for Merchant" },
  903: { value: "Error In 3D Authentication of Tokenize request" },
  904: { value: "Invalid Tokenize ressponse" },
  905: { value: "Invalid Token operation" },
  906: { value: "Invalid Card Token" },
  907: { value: "Plesae provide valid mobile number" },
  908: { value: "This Currency not allowed for STS Pay" },
  909: { value: "This transaction type not supported for destination" },
  915: { value: "Maximum Amount Limit Exceeds for transaction" },
  916: { value: "Terminal is not supported for link base api payment" },
  917: { value: "Link Flag Invalid" },
  918: { value: "Expiry days is not greater than 4" },
  919: {
    value: "PaymentFor field is invalid or length is greater than 50 character",
  },
  920: { value: "Link for linked based trasnaction is not created" },
  921: { value: "Invalid Link Id" },
  922: { value: "Link Base transaction already success,failure or deleted" },
  923: { value: "PaymentFor request field is necessary for link base" },
  924: { value: "Merchant id not supported for link base payment" },
  925: { value: "Merchant status is not active" },
  926: { value: "Terminal status is not active" },
  927: { value: "User Field 5 is mandatory for link base" },
  928: { value: "Expiry Days field is not valid" },
  929: { value: "Partial payment allowed field is invalid" },
  930: { value: "Email Id field is mandatory for link base api" },
  931: { value: "Please provide valid mobile number in udf4" },
  932: { value: "Excessive refund not enabled Terminal level" },
  933: { value: "Excessive refund amount limit not set Terminal level" },
  935: { value: "Terminal MID or MID Password not configured" },
  936: { value: "STCPAY Direct Integration not supported for given terminal" },
  937: { value: "Card brand not supported for given terminal" },
  938: { value: "transaction id not match with existing tranid" },
  939: { value: "Linkbase partial amount is not valid" },
  940: { value: "Link Base Partial Amount is greater than actual amount" },
  941: { value: "card type not found in applepay card token" },
  942: { value: "payment link send options not configured" },
  943: { value: "Either Email Address or Contact Number Field is required" },
  944: { value: "send link via SMS limit exceeded" },
  945: { value: "invalid length of tran description field for b2b" },
  B501: { value: "Invalid CIF number" },
  B502: { value: "Beneficiary is not active" },
  B503: { value: "Sub-user not found" },
  B504: { value: "Beneficiary not found" },
  B505: { value: "Beneficiary code is required" },
  B506: { value: "Currency is not allowed for international transfers" },
  B507: { value: "User ID does not exist" },
  B508: { value: "User ID does not match the provided CIF & Beneficiary Code" },
  B509: { value: "Sub-user id is mandatory" },
  B510: { value: "Sub-user not linked to main user" },
  B511: { value: "Commission amount missing" },
  B512: { value: "Commission currency missing" },
  B513: { value: "Commission code incompatible with beneficiary our charges" },
  B514: { value: "Commission code incompatible" },
  B515: { value: "Credit account not within the bank" },
  B516: { value: "Credit Currency missing" },
  B517: { value: "Current amount currency missing" },
  B518: { value: "Debit currency missing" },
  B519: { value: "Debit currency incompatible with account currency" },
  B521: { value: "Invalid field name" },
  B522: { value: "Function is disabled from service provider" },
  B523: { value: "Transaction id not supplied" },
  B524: { value: "Invalid commission code" },
  B525: {
    value:
      "Unauthorized Override - Account balance will fall below locked amount",
  },
  B526: { value: "Override was encountered" },
  B527: { value: "Invalid beneficiary account" },
  B528: { value: "Missing beneficiary account" },
  B529: { value: "Beneficiary account is required" },
  B530: { value: "Invalid customer" },
  B531: { value: "Beneficiary name is required" },
  B533: { value: "Beneficiary bank code not supplied" },
  B534: { value: "Invalid bank code" },
  B538: { value: "Invalid SWIFT code" },
  B539: { value: "Beneficiary currency is required" },
  B541: { value: "Alinma beneficiary account is required" },
  B542: { value: "Customer own account not allowed as a credit account" },
  B543: { value: "Beneficiary country is required" },
  B544: { value: "Detail of charge is required" },
  B545: { value: "Corresponding bank code is required" },
  B546: { value: "Beneficiary proof of identification is required" },
  B548: { value: "Invalid beneficiary type" },
  B549: { value: "User ID provided is not a main user ID" },
  B550: { value: "Beneficiary type is required" },
  B551: { value: "Cannot create international beneficiary with SAR currency" },
  B552: { value: "Invalid fund transfer purpose" },
  B553: { value: "Invalid detail of charge" },
  B554: { value: "Inma Beneficiary cannot be created with own account" },
  B555: { value: "Invalid beneficiary name" },
  B556: { value: "Invalid account type" },
  B557: { value: "Invalid Alinma account length" },
  B559: { value: "Invalid beneficiary name length" },
  B561: { value: "Currency is not allowed for international transfers" },
  B562: { value: "Creation of international beneficiary is not allowed" },
  B563: { value: "Creation of Alinma beneficiary is not allowed" },
  B564: { value: "Creation of local (KSA) beneficiary is not allowed" },
  B565: { value: "Adhoc beneficiary information could not be validated" },
  B566: { value: "Unknown database errors" },
  B567: { value: "Unrecoverable integration error" },
  B568: { value: "Transaction requires supervisor override" },
};
