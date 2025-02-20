@HotelFeature
Feature: Hotel Feature Travel PHP 

  @BookNoLogin
  Scenario: Book a hotel without login 
    Given User have searched for hotels in "Dubai" without login
    And User select card hotel "Movenpick Grand Al Bustan"
    When User create hotel booking for "1" night and "Single" type
    And Non-Registered User continue finishing transaction
    Then User have the transaction id

  # Scenario Outline: Searching hotel 
  #   Given User logged in as <username> with password <password>
  #   And User open the "Hotels" menu
  #   When User search city "Dubai"
  #   Then User see "Dubai" city in result card

  # Scenario Outline: Book a hotel without changing any traveller option 
  #   Given User have searched for hotels in "Dubai"
  #   And User select card hotel "Grand Excelsior Deira Hotel"
  #   When User create hotel booking for "1" night and "TWIN DELUXE" type
  #   And Registered User continue finishing transaction
  #   Then User have the transaction id

  # @CancelBook
  # Scenario: Cancel book a hotel directly after booking
  #   Given User have searched for hotels in "Dubai"
  #   And User select card hotel "Grand Excelsior Deira Hotel"
  #   And User create hotel booking for "1" night and "TWIN DELUXE" type
  #   And Registered User continue finishing transaction
  #   And User have the transaction id
  #   When User cancel the book


    Examples:
      | username | password             | message                        |
      |  user@phptravels.com | demouser | You logged into a secure area! |
 
