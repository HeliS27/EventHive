namespace TechFest.Core.Exceptions;

public class DuplicateRegistrationException : Exception
{
    public DuplicateRegistrationException()
        : base("You have already registered for this event.") { }

    public DuplicateRegistrationException(string message)
        : base(message) { }
}
