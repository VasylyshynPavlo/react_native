namespace WebShopApi.Models.Product;

public class ProductItemViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public double Price { get; set; }

    public string? CategoryName { get; set; }
    public List<string> ImageUrls { get; set; } = new();
}
