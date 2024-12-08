@HotelTest
Feature: Hotel Feature Travel PHP 

  Scenario Outline: Searching hotel 
    Given User logged in as <username> with password <password>
    And User open the "Hotels" menu
    When User search city "Dubai"
    Then User see "Dubai" city in result card

  # Scenario Outline: Book a hotel without changing any traveller option 
  #   Given User have searched for hotels in "Dubai"
  #   And User select card hotel "Four Points by Sheraton Bur Dubai"
  #   When User create hotel booking 
  #   And User continue finishing transaction
  #   Then User have the transaction id
  
  # Scenario Outline: Book a hotel with changing traveller option 
  #   Given User have searched for hotels in "Dubai"
  #   When User create hotel booking 
  #   And User continue finishing transaction
  #   Then User have the transaction id 


    Examples:
      | username | password             | message                        |
      |  user@phptravels.com | demouser | You logged into a secure area! |
