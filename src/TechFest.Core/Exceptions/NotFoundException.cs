namespace TechFest.Core.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string entity)
        : base($"{entity} not found.") { }

    public NotFoundException(string entity, Guid id)
        : base($"{entity} with ID '{id}' not found.") { }
}
