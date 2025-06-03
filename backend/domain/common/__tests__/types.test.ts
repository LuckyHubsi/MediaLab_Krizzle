import {
  string30,
  string750,
  string50000,
  optionalString,
  optionalNullableString,
  hexColor,
  optionalHexColor,
  date,
  positiveInt,
  optionalPositiveInt,
  boolean,
} from "@/backend/domain/common/types";

describe("string30", () => {
  it("accepts valid strings between 1 and 30 characters", () => {
    expect(string30.safeParse("m").success).toBe(true);
    expect(string30.safeParse("m".repeat(30)).success).toBe(true);
  });

  it("fails for empty string", () => {
    const result = string30.safeParse("");
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/minimum/);
  });

  it("fails for string longer than 30 characters", () => {
    const result = string30.safeParse("m".repeat(31));
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0].message).toMatch(/maximum/);
  });
});

describe("string750", () => {
  it("accepts up to 750 characters", () => {
    expect(string750.safeParse("test").success).toBe(true);
    expect(string750.safeParse("m".repeat(750)).success).toBe(true);
  });

  it("fails over 750 characters", () => {
    expect(string750.safeParse("m".repeat(751)).success).toBe(false);
  });
});

describe("string50000", () => {
  it("accepts strings up to 50000 characters or null", () => {
    expect(string50000.safeParse("m").success).toBe(true);
    expect(string50000.safeParse("m".repeat(50000)).success).toBe(true);
    expect(string50000.safeParse(null).success).toBe(true);
  });

  it("fails for over 50000 characters", () => {
    expect(string50000.safeParse("m".repeat(50001)).success).toBe(false);
  });
});

describe("optionalString", () => {
  it("accepts string or undefined", () => {
    expect(optionalString.safeParse("test").success).toBe(true);
    expect(optionalString.safeParse(undefined).success).toBe(true);
  });

  it("fails on non-string", () => {
    expect(optionalString.safeParse(1).success).toBe(false);
  });
});

describe("optionalNullableString", () => {
  it("accepts string, null, or undefined", () => {
    expect(optionalNullableString.safeParse("m").success).toBe(true);
    expect(optionalNullableString.safeParse(null).success).toBe(true);
    expect(optionalNullableString.safeParse(undefined).success).toBe(true);
  });

  it("fails for non-string types", () => {
    expect(optionalNullableString.safeParse(1).success).toBe(false);
  });
});

describe("hexColor", () => {
  it("accepts valid hex colors", () => {
    expect(hexColor.safeParse("#000").success).toBe(true);
    expect(hexColor.safeParse("#FFFFFF").success).toBe(true);
    expect(hexColor.safeParse("#ABC123").success).toBe(true);
  });

  it("rejects invalid hex codes", () => {
    expect(hexColor.safeParse("000").success).toBe(false);
    expect(hexColor.safeParse("#1234").success).toBe(false);
    expect(hexColor.safeParse("#wwwwww").success).toBe(false);
  });
});

describe("optionalHexColor", () => {
  it("accepts hex color or undefined", () => {
    expect(optionalHexColor.safeParse("#FFF").success).toBe(true);
    expect(optionalHexColor.safeParse(undefined).success).toBe(true);
  });

  it("fails for invalid strings", () => {
    expect(optionalHexColor.safeParse("blue").success).toBe(false);
  });
});

describe("date", () => {
  it("accepts valid Date objects", () => {
    expect(date.safeParse(new Date()).success).toBe(true);
    expect(date.safeParse(new Date("2024-01-01")).success).toBe(true);
  });

  it("fails for strings or numbers", () => {
    expect(date.safeParse("2024-01-01").success).toBe(false);
    expect(date.safeParse(Date.now()).success).toBe(false);
  });
});

describe("positiveInt", () => {
  it("accepts positive integers", () => {
    expect(positiveInt.safeParse(1).success).toBe(true);
    expect(positiveInt.safeParse(999).success).toBe(true);
  });

  it("fails for zero, negative, or non-integer", () => {
    expect(positiveInt.safeParse(0).success).toBe(false);
    expect(positiveInt.safeParse(-5).success).toBe(false);
    expect(positiveInt.safeParse(1.5).success).toBe(false);
  });
});

describe("optionalPositiveInt", () => {
  it("accepts positive integers, null, or undefined", () => {
    expect(optionalPositiveInt.safeParse(1).success).toBe(true);
    expect(optionalPositiveInt.safeParse(null).success).toBe(true);
    expect(optionalPositiveInt.safeParse(undefined).success).toBe(true);
  });

  it("fails for invalid numbers", () => {
    expect(optionalPositiveInt.safeParse(-1).success).toBe(false);
    expect(optionalPositiveInt.safeParse(0).success).toBe(false);
  });
});

describe("boolean", () => {
  it("accepts true or false", () => {
    expect(boolean.safeParse(true).success).toBe(true);
    expect(boolean.safeParse(false).success).toBe(true);
  });

  it("rejects non-boolean", () => {
    expect(boolean.safeParse("true").success).toBe(false);
    expect(boolean.safeParse(1).success).toBe(false);
  });
});
