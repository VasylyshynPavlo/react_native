using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebShopApi.Abstract;
using WebShopApi.Data;
using WebShopApi.Data.Entities;
using WebShopApi.Data.Entities.Identity;
using WebShopApi.Models.Product;

namespace WebShopApi.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
[Authorize]
public class ProductsController(
    WebShopDbContext context,
    UserManager<UserEntity> userManager,
    IImageService imageService,
    IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetList()
    {
        try
        {
            string userName = User.Claims.FirstOrDefault()?.Value;
            var user = await userManager.FindByEmailAsync(userName);

            var list = await context.Products
                .Where(p => p.UserId == user.Id)
                .ProjectTo<ProductItemViewModel>(mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(list);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetProduct(int id)
    {
        try
        {
            string userName = User.Claims.FirstOrDefault()?.Value;
            var user = await userManager.FindByEmailAsync(userName);

            var product = await context.Products
                .Where(p => p.Id == id && p.UserId == user.Id)
                .ProjectTo<ProductItemViewModel>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound();

            return Ok(product);
        }
        catch (Exception e)
        {
            return BadRequest(new { error = e.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] ProductCreateViewModel model)
    {
        try
        {
            string userName = User.Claims.FirstOrDefault()?.Value;
            var user = await userManager.FindByEmailAsync(userName);

            var product = mapper.Map<ProductEntity>(model);
            product.UserId = user.Id;

            var imageNames = await imageService.SaveImagesAsync(model.Images);
            foreach (var imageName in imageNames)
            {
                product.Images.Add(new ProductImageEntity { Image = imageName });
            }
            product.Description = model.Description;
            product.Price = model.Price;

            context.Products.Add(product);
            await context.SaveChangesAsync();

            return Ok(new { id = product.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Edit([FromForm] ProductEditViewModel model)
    {
        try
        {
            string userName = User.Claims.FirstOrDefault()?.Value;
            var user = await userManager.FindByEmailAsync(userName);

            var product = await context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == model.Id && p.UserId == user.Id);

            if (product == null)
                return NotFound();

            var oldImages = product.Images.Select(i => i.Image).ToList();
            context.ProductImages.RemoveRange(product.Images);
            imageService.DeleteImagesIfExists(oldImages);

            mapper.Map(model, product);

            var imageNames = await imageService.SaveImagesAsync(model.Images);
            product.Images = imageNames.Select(name => new ProductImageEntity { Image = name }).ToList();

            await context.SaveChangesAsync();

            return Ok(new { id = product.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        try
        {
            string userName = User.Claims.FirstOrDefault()?.Value;
            var user = await userManager.FindByEmailAsync(userName);

            var product = await context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == user.Id);

            if (product == null)
                return NotFound();

            var images = product.Images.Select(i => i.Image);
            imageService.DeleteImagesIfExists(images);

            context.ProductImages.RemoveRange(product.Images);
            context.Products.Remove(product);
            await context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
