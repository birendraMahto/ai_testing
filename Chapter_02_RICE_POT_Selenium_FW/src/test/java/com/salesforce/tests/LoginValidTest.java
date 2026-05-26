package com.salesforce.tests;

import com.salesforce.pages.LoginPage;
import io.qameta.allure.Description;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

@Feature("Salesforce Login - Valid Scenarios")
public class LoginValidTest extends BaseTest {

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
    @Severity(SeverityLevel.BLOCKER)
    @Description("Verify that the Salesforce login page title contains 'Salesforce'")
    public void verifyLoginPageTitle() {
        try {
            String title = loginPage.getPageTitle();
            Assert.assertTrue(title.contains("Salesforce"),
                    "Page title does not contain 'Salesforce'. Actual: " + title);
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginPageTitle failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 2)
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify that the username field is displayed on the login page")
    public void verifyUsernameFieldDisplayed() {
        try {
            Assert.assertTrue(loginPage.isUsernameFieldDisplayed(),
                    "Username field is not displayed on the login page");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyUsernameFieldDisplayed failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 3)
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify that the password field is displayed on the login page")
    public void verifyPasswordFieldDisplayed() {
        try {
            Assert.assertTrue(loginPage.isPasswordFieldDisplayed(),
                    "Password field is not displayed on the login page");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyPasswordFieldDisplayed failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 4)
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify that the login button is displayed on the login page")
    public void verifyLoginButtonDisplayed() {
        try {
            Assert.assertTrue(loginPage.isLoginButtonDisplayed(),
                    "Login button is not displayed on the login page");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyLoginButtonDisplayed failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 5)
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify that the Remember Me checkbox can be toggled")
    public void verifyRememberMeCheckbox() {
        try {
            Assert.assertFalse(loginPage.isRememberMeSelected(),
                    "Remember Me checkbox should not be selected by default");
            loginPage.clickRememberMe();
            Assert.assertTrue(loginPage.isRememberMeSelected(),
                    "Remember Me checkbox should be selected after clicking");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyRememberMeCheckbox failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 6)
    @Severity(SeverityLevel.BLOCKER)
    @Description("Verify login attempt with valid credentials navigates away from login page")
    public void verifyValidLoginAttempt() {
        try {
            String loginUrl = config.getProperty("base.url");
            loginPage.doLogin(
                    config.getProperty("valid.username"),
                    config.getProperty("valid.password")
            );
            new org.openqa.selenium.support.ui.WebDriverWait(driver, java.time.Duration.ofSeconds(15))
                    .until(d -> !d.getCurrentUrl().equals(loginUrl));
            String currentUrl = driver.getCurrentUrl();
            Assert.assertNotEquals(currentUrl, loginUrl,
                    "URL did not change after valid login attempt");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("verifyValidLoginAttempt failed: " + e.getMessage(), e);
        }
    }
}
