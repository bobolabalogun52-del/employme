"""
Compound Interest Calculator
A simple CLI-based Python program.

Formula:
A = P(1 + r/n)^(nt)

Where:
P = principal amount
r = annual interest rate as a decimal
n = number of times interest is compounded per year
t = time in years
A = final amount
"""

def calculate_compound_interest(principal, annual_rate, compounds_per_year, years):
    """Return the final amount and compound interest earned."""
    rate = annual_rate / 100
    amount = principal * (1 + rate / compounds_per_year) ** (
        compounds_per_year * years
    )
    interest = amount - principal
    return amount, interest


def get_positive_number(prompt):
    """Ask the user for a number greater than zero."""
    while True:
        try:
            value = float(input(prompt))
            if value <= 0:
                print("Please enter a number greater than 0.")
                continue
            return value
        except ValueError:
            print("Please enter a valid number.")


def main():
    """Run the compound interest calculator."""
    print("=" * 45)
    print("       COMPOUND INTEREST CALCULATOR")
    print("=" * 45)

    principal = get_positive_number("Enter principal amount: ₦")
    annual_rate = get_positive_number("Enter annual interest rate (%): ")
    compounds_per_year = int(
        get_positive_number("Enter compounds per year (e.g. 12): ")
    )
    years = get_positive_number("Enter time in years: ")

    amount, interest = calculate_compound_interest(
        principal, annual_rate, compounds_per_year, years
    )

    print("\n" + "-" * 45)
    print(f"Principal Amount : ₦{principal:,.2f}")
    print(f"Final Amount     : ₦{amount:,.2f}")
    print(f"Interest Earned  : ₦{interest:,.2f}")
    print("-" * 45)


if __name__ == "__main__":
    main()
