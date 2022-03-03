# WhatsApp number verify

Based on Abhishek Biswal 'whatsapp-verify':
https://github.com/AbhishekBiswal/whatsapp-verify

### What

Tool to verify the existence of a phone number on Whatsapp.
Updated and optimized version for checking large list of numbers without ban(Checked with 2500 numbers ≈ 12hrs).

### How

Uses Whatsapp Web to verify if the number has an associated Whatsapp account without sending a message.

### Prepare

1. Install dependencies

```
npm run bootstrap
```

2. Login (All user data is stored only in project folder './profileData')

```
npm run login
```

### How To Use

Check one Phone Number:

```
npm run check 919898989898
```


Check large list of numbers:

Place your list in src/numbers/txt.

**_Note_** Each number must be on a new line. There are two acceptable formats:

```
919898989898
919398489898
919892349898
```

OR

```
Adam Smith: +38(055)333-22-22
James Brows: 919398489898
Neo: +919892349898
```

Run check script:

```
npm run check:list
```

You can find all results in 'logs' folder.

- "logs.txt" is a log file.
- "tempResults.json" updating every successful check. Can be used to retrieve results when the process is not finished or exited with an error.
- "results.json" final results with only valid numbers.

**_Caution_** Using method to verify numbers in bulk can result in the logged in number being banned by WhatsApp
