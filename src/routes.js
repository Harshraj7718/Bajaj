import express from "express";

const router = express.Router();

function isAlphabetOnlyToken(token) {
  return typeof token === "string" && /^[a-zA-Z]+$/.test(token);
}

function isIntegerString(token) {
  return typeof token === "string" && /^-?\d+$/.test(token);
}

function buildConcatStringFromAlphabetTokensUpper(tokensUpper) {
  const letters = tokensUpper.join("").split("");
  const reversed = letters.reverse();
  return reversed
    .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

router.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body || {};

    if (!Array.isArray(data)) {
      return res
        .status(200)
        .json({ is_success: false, error: "data must be an array" });
    }

    const emailId = String(process.env.EMAIL_ID);
    const rollNumber = String(process.env.COLLEGE_ROLL);
    let userId = String(process.env.USER_ID);
    if (!userId) {
      const fullNameLower = String(
        process.env.FULL_NAME || "harsh_raj"
      ).toLowerCase();
      const dob = String(process.env.DOB_DDMMYYYY);
      userId = `${fullNameLower}_${dob}`;
    }

    const evenNumbers = [];
    const oddNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = 0;

    for (const item of data) {
      if (
        (typeof item === "number" && Number.isInteger(item)) ||
        isIntegerString(item)
      ) {
        const num = Number(item);
        if (!Number.isNaN(num)) {
          sum += num;
          if (num % 2 === 0) {
            evenNumbers.push(String(item));
          } else {
            oddNumbers.push(String(item));
          }
          continue;
        }
      }

      if (isAlphabetOnlyToken(item)) {
        alphabets.push(String(item).toUpperCase());
        continue;
      }

      specialCharacters.push(item);
    }

    const concatString = buildConcatStringFromAlphabetTokensUpper(alphabets);

    return res.status(200).json({
      is_success: true,
      user_id: userId,
      email: emailId,
      roll_number: rollNumber,
      odd_numbers: oddNumbers,
      even_numbers: evenNumbers,
      alphabets,
      special_characters: specialCharacters,
      sum: String(sum),
      concat_string: concatString,
    });
  } catch (err) {
    return res
      .status(200)
      .json({ is_success: false, error: err.message || "unexpected error" });
  }
});

export default router;
