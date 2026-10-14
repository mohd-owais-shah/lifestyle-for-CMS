import {
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_QUERY,
  CUSTOMER_RECOVER_MUTATION,
  CUSTOMER_RESET_BY_URL_MUTATION,
  CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
} from '~/graphql/customerQueries';

/**
 * Log in a customer using Storefront API
 * @param {object} params
 * @param {object} params.storefront
 * @param {object} params.session
 * @param {string} params.email
 * @param {string} params.password
 */
export async function loginCustomer({storefront, session, email, password}) {
  const cleanEmail = String(email || '')
    .trim()
    .toLowerCase();
  const cleanPassword = String(password || '').trim();

  if (!cleanEmail || !cleanPassword) {
    return {
      error: 'Please enter both email and password.',
      errors: [],
    };
  }

  try {
    const {customerAccessTokenCreate} = await storefront.mutate(
      CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
      {
        variables: {
          input: {
            email: cleanEmail,
            password: cleanPassword,
          },
        },
      },
    );

    const userErrors = customerAccessTokenCreate?.customerUserErrors || [];
    if (userErrors.length > 0) {
      const code = userErrors[0].code;
      const originalMsg = userErrors[0].message || '';
      let friendlyMessage = originalMsg;

      if (
        code === 'UNIDENTIFIED_CUSTOMER' ||
        originalMsg.toLowerCase().includes('unidentified')
      ) {
        friendlyMessage =
          'Incorrect email or password. If you recently created your account, please verify your credentials or reset your password.';
      }

      return {
        error: friendlyMessage,
        errors: userErrors,
      };
    }

    const token = customerAccessTokenCreate?.customerAccessToken;
    if (!token?.accessToken) {
      return {
        error: 'Unable to authenticate. Please check your credentials.',
        errors: [],
      };
    }

    // Persist in session
    session.set('customerAccessToken', token.accessToken);
    session.set('customerAccessTokenExpiresAt', token.expiresAt);

    return {
      success: true,
      accessToken: token.accessToken,
      expiresAt: token.expiresAt,
    };
  } catch (err) {
    return {
      error: err?.message || 'Login failed. Please try again.',
      errors: [],
    };
  }
}

/**
 * Register a new customer using Storefront API
 * @param {object} params
 * @param {object} params.storefront
 * @param {object} params.session
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} [params.firstName]
 * @param {string} [params.lastName]
 * @param {string} [params.phone]
 */
export async function registerCustomer({
  storefront,
  session,
  email,
  password,
  firstName,
  lastName,
  phone,
}) {
  const cleanEmail = String(email || '')
    .trim()
    .toLowerCase();
  const cleanPassword = String(password || '').trim();

  if (!cleanEmail || !cleanPassword) {
    return {
      error: 'Email and password are required.',
      errors: [],
    };
  }

  if (cleanPassword.length < 5) {
    return {
      error: 'Password must be at least 5 characters long.',
      errors: [],
    };
  }

  try {
    const input = {
      email: cleanEmail,
      password: cleanPassword,
      ...(firstName ? {firstName: String(firstName).trim()} : {}),
      ...(lastName ? {lastName: String(lastName).trim()} : {}),
      ...(phone ? {phone: String(phone).trim()} : {}),
    };

    const {customerCreate} = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {input},
    });

    const userErrors = customerCreate?.customerUserErrors || [];
    if (userErrors.length > 0) {
      return {
        error: userErrors[0].message || 'Failed to create account.',
        errors: userErrors,
      };
    }

    // Attempt automatic login after registration with the exact same credentials
    const loginResult = await loginCustomer({
      storefront,
      session,
      email: cleanEmail,
      password: cleanPassword,
    });

    if (loginResult.success) {
      return {
        success: true,
        autoLoggedIn: true,
        customer: customerCreate?.customer,
      };
    }

    // If auto-login fails (e.g., store requires email confirmation)
    return {
      success: true,
      autoLoggedIn: false,
      message:
        'Account created successfully! Please check your email to activate or log in.',
      customer: customerCreate?.customer,
    };
  } catch (err) {
    return {
      error: err?.message || 'Registration failed. Please try again.',
      errors: [],
    };
  }
}

/**
 * Trigger forgot password recovery email
 * @param {object} params
 * @param {object} params.storefront
 * @param {string} params.email
 */
export async function recoverCustomerPassword({storefront, email}) {
  const cleanEmail = String(email || '')
    .trim()
    .toLowerCase();

  if (!cleanEmail) {
    return {
      error: 'Please enter your email address.',
      errors: [],
    };
  }

  try {
    const {customerRecover} = await storefront.mutate(
      CUSTOMER_RECOVER_MUTATION,
      {
        variables: {
          email: cleanEmail,
        },
      },
    );

    const userErrors = customerRecover?.customerUserErrors || [];
    if (userErrors.length > 0) {
      return {
        error: userErrors[0].message || 'Failed to send recovery email.',
        errors: userErrors,
      };
    }

    return {
      success: true,
      message:
        'If an account exists with this email, you will receive password reset instructions shortly.',
    };
  } catch (err) {
    return {
      error: err?.message || 'Failed to send recovery email. Please try again.',
      errors: [],
    };
  }
}

/**
 * Reset customer password with URL
 * @param {object} params
 * @param {object} params.storefront
 * @param {object} params.session
 * @param {string} params.resetUrl
 * @param {string} params.password
 */
export async function resetCustomerPassword({
  storefront,
  session,
  resetUrl,
  password,
}) {
  const cleanPassword = String(password || '').trim();

  if (!resetUrl || !cleanPassword) {
    return {
      error: 'Reset URL and new password are required.',
      errors: [],
    };
  }

  try {
    const {customerResetByUrl} = await storefront.mutate(
      CUSTOMER_RESET_BY_URL_MUTATION,
      {
        variables: {
          resetUrl,
          password: cleanPassword,
        },
      },
    );

    const userErrors = customerResetByUrl?.customerUserErrors || [];
    if (userErrors.length > 0) {
      return {
        error: userErrors[0].message || 'Password reset failed.',
        errors: userErrors,
      };
    }

    const token = customerResetByUrl?.customerAccessToken;
    if (token?.accessToken) {
      session.set('customerAccessToken', token.accessToken);
      session.set('customerAccessTokenExpiresAt', token.expiresAt);
    }

    return {
      success: true,
      customer: customerResetByUrl?.customer,
    };
  } catch (err) {
    return {
      error: err?.message || 'Password reset failed. Please try again.',
      errors: [],
    };
  }
}

/**
 * Log out customer and clear session
 * @param {object} params
 * @param {object} params.storefront
 * @param {object} params.session
 */
export async function logoutCustomer({storefront, session}) {
  const token = session.get('customerAccessToken');

  if (token) {
    try {
      await storefront.mutate(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, {
        variables: {customerAccessToken: token},
      });
    } catch {
      // Ignore token delete error if expired
    }
  }

  session.unset('customerAccessToken');
  session.unset('customerAccessTokenExpiresAt');

  return {success: true};
}

/**
 * Fetch customer profile using session token
 * @param {object} params
 * @param {object} params.storefront
 * @param {object} params.session
 */
export async function getCustomerProfile({storefront, session}) {
  const token = session.get('customerAccessToken');
  if (!token) return null;

  try {
    const response = await storefront.query(CUSTOMER_QUERY, {
      variables: {customerAccessToken: token},
      cache: storefront.CacheNone(),
    });

    const customer = response?.customer || null;
    if (!customer) {
      session.unset('customerAccessToken');
      session.unset('customerAccessTokenExpiresAt');
      return null;
    }

    return customer;
  } catch {
    session.unset('customerAccessToken');
    session.unset('customerAccessTokenExpiresAt');
    return null;
  }
}
