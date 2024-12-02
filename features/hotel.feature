Feature: Hotel Feature Travel PHP 

  Scenario Outline: As a user, I can use hotel features 

    Given I am on the login page
    When I login with <username> and <password>
    Then I open the "Hotels" menu 
    Then I search city "Dubai" 

    Examples:
      | username | password             | message                        |
      |  user@phptravels.com | demouser | You logged into a secure area! |
