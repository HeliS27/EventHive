namespace TechFest.Core.Exceptions;

public class EventFullException : Exception
{
    public EventFullException()
        : base("This event is sold out. No seats available.") { }

    public EventFullException(string message)
        : base(message) { }
}
