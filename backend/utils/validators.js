const { productConstants } = require("./constants");
const countries = require("i18n-iso-countries");
const sharp = require("sharp");

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhoneNumber = (phone) => {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
};

const isValidBelgiumPhoneNumber = (phone) => {
  return /^32[1-9]\d{7,8}$/.test(phone);
};

const isValidDate = (date) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const isValidOrderStatus = (status) => {
  return ["PENDING", "COMPLETED", "CANCELLED"].includes(status);
};

const isValidPaymentStatus = (status) => {
  return ["PENDING", "SUCCESS", "FAILED", "REFUNDED"].includes(status);
};

const isValidBrandStatus = (status) => {
  return ["ACTIVE", "INACTIVE"].includes(status);
};

const isValidCustomerStatus = (status) => {
  return ["ACTIVE", "SUSPENDED"].includes(status);
};

// Products related validations
const isValidProductStatus = (status) => {
  return ["ACTIVE", "INACTIVE"].includes(status);
};

const isValidProductCategory = (category) => {
  const matchedCategory = productConstants.PRODUCT_CATEGORY.find(
    (categoryConst) => categoryConst.toLowerCase() === category.toLowerCase()
  );

  if (!matchedCategory) {
    throw new Error("Invalid category");
  }
  return matchedCategory;
};

const isValidProductTag = (tag) => {
  const matchedTag = productConstants.PRODUCT_TAG.find(
    (tagConst) => tagConst.toLowerCase() === tag.toLowerCase()
  );

  if (!matchedTag) {
    throw new Error("Invalid tag");
  }
  return matchedTag;
};

const isValidPlanInclude = (plans) => {
  let result = true;
  plans.forEach((plan) => {
    if (productConstants.PLAN_INCLUDES.includes(plan)) {
      result = result && true;
    } else {
      result = result && false;
    }
  });
  return result;
};

const isValidBatchStatus = (status) => {
  return ["ACTIVE", "INACTIVE"].includes(status);
};

const isValidCountryCodes = (codes) => {
  let result = true;
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    if (typeof code !== "string") {
      result = false;
      break;
    } else {
      if (countries.isValid(code)) {
        result = result && true;
      } else {
        result = false;
        break;
      }
    }
  }
  return result;
};

const isValidPaymentMethod = (method) => {
  return ["Visa", "bcmc", "MasterCard"].includes(method);
};

const isValidBannerStatus = (status) => {
  return ["ACTIVE", "INACTIVE"].includes(status);
};

const validateImageDimensions = async (
  fileBuffer,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight
) => {
  try {
    const metadata = await sharp(fileBuffer).metadata();
    const { width, height } = metadata;

    if (width < minWidth || height < minHeight) {
      return { valid: false, message: "Image dimensions are too small" };
    }
    if (width > maxWidth || height > maxHeight) {
      return { valid: false, message: "Image dimensions are too large" };
    }

    return { valid: true, width, height };
  } catch (error) {
    throw new Error("Error validating image dimensions");
  }
};

const isValidSimSwapStatus = (status) => {
  return ["OPEN", "IN_REVIEW", "APPROVED", "REJECTED"].includes(status);
};

module.exports = {
  isValidEmail,
  isValidPhoneNumber,
  isValidBelgiumPhoneNumber,
  isValidDate,
  isValidOrderStatus,
  isValidPaymentStatus,
  isValidBrandStatus,
  isValidCustomerStatus,
  isValidProductStatus,
  isValidPlanInclude,
  isValidProductCategory,
  isValidProductTag,
  isValidBatchStatus,
  isValidCountryCodes,
  isValidPaymentMethod,
  isValidBannerStatus,
  validateImageDimensions,
  isValidSimSwapStatus,
};
