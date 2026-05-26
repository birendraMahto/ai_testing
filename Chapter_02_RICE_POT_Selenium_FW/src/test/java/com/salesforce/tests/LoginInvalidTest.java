package com.salesforce.tests;

import com.salesforce.pages.LoginPage;
import io.qameta.allure.Description;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

@Feature("Salesforce Login - Invalid Scenarios")
public class LoginInvalidTest extends BaseTest {

    private LoginPage loginPage;

    @BeforeMethod
    public void initPage() {
        try {
            driver.get(config.getProperty("base.url"));
            loginPage = new LoginPage(driver);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize LoginPage: " + e.getMessage(), e);
        }
    }

    @Test(priority = 1)
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify error message when submitting login with empty credentials")
    public void verifyLoginWithEmptyCredentials() {
        try {
            loginPage.clickLoginButton();
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message should be displayed for empty credentials");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithEmptyCredentials failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 2)
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify error message when submitting login with empty password")
    public void verifyLoginWithEmptyPassword() {
        try {
            loginPage.enterUsername(config.getProperty("valid.username"));
            loginPage.clickLoginButton();
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message should be displayed when password is empty");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithEmptyPassword failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 3)
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify error message when submitting login with empty username")
    public void verifyLoginWithEmptyUsername() {
        try {
            loginPage.enterPassword(config.getProperty("valid.password"));
            loginPage.clickLoginButton();
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message should be displayed when username is empty");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithEmptyUsername failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 4)
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify error message when logging in with invalid username and valid password")
    public void verifyLoginWithInvalidUsername() {
        try {
            loginPage.doLogin(
                    config.getProperty("invalid.username"),
                    config.getProperty("valid.password")
            );
            String errorText = loginPage.getErrorMessage();
            Assert.assertTrue(errorText.length() > 0,
                    "Error message should be displayed for invalid username");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithInvalidUsername failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 5)
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify error message when logging in with valid username and invalid password")
    public void verifyLoginWithInvalidPassword() {
        try {
            loginPage.doLogin(
                    config.getProperty("valid.username"),
                    config.getProperty("invalid.password")
            );
            String errorText = loginPage.getErrorMessage();
            Assert.assertTrue(errorText.length() > 0,
                    "Error message should be displayed for invalid password");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithInvalidPassword failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 6)
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify error message when logging in with both invalid username and password")
    public void verifyLoginWithInvalidCredentials() {
        try {
            loginPage.doLogin(
                    config.getProperty("invalid.username"),
                    config.getProperty("invalid.password")
            );
            String errorText = loginPage.getErrorMessage();
            Assert.assertTrue(errorText.length() > 0,
                    "Error message should be displayed for invalid credentials");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithInvalidCredentials failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 7)
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify error message when logging in with special characters in both fields")
    public void verifyLoginWithSpecialCharacters() {
        try {
            loginPage.doLogin("!@#$%^&*()", "!@#$%^&*()");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                    "Error message should be displayed for special character credentials");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginWithSpecialCharacters failed: " + e.getMessage(), e);
        }
    }
}
