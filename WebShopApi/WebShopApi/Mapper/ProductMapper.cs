using AutoMapper;
using WebShopApi.Data.Entities;
using WebShopApi.Models.Product;

namespace WebShopApi.Mapper;

public class ProductMapper : Profile
{
    public ProductMapper()
    {
        CreateMap<ProductEntity, ProductItemViewModel>()
            .ForMember(dest => dest.CategoryName,
                opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
            .ForMember(dest => dest.ImageUrls,
                opt => opt.MapFrom(src => src.Images.Select(i => i.Image).ToList()))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price));

        CreateMap<ProductCreateViewModel, ProductEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price));

        CreateMap<ProductEditViewModel, ProductEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price));
    }
}