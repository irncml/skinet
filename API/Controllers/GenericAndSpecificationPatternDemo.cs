using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace API.Controllers
{

    abstract class BaseEntity_
    {
        public int Id { get; set; }
    }

    class Product_ : BaseEntity_
    {
        public string Name { get; set; }
    }

    interface ISpecification_<T>
    {
        Expression<Func<T, bool>> Criteria_ { get; }
        List<Expression<Func<T, object>>> Includes_ { get; }
    }

    abstract class BaseSpecification_<T> : ISpecification_<T> where T : BaseEntity_
    {
        public Expression<Func<T, bool>> Criteria_ { get; }
        public List<Expression<Func<T, object>>> Includes_ { get; }
            = new List<Expression<Func<T, object>>>();

        public BaseSpecification_() { }

        public BaseSpecification_(Expression<Func<T, bool>> criteria)
            => Criteria_ = criteria;

        protected void AddIncludes(Expression<Func<T, object>> includeExpression)
            => Includes_.Add(includeExpression);
    }

    class GetProductSpecification_ : BaseSpecification_<Product_>
    {
        public GetProductSpecification_() { }
        public GetProductSpecification_(int id) : base(x => x.Id == id) { }
    }

    class SpecificationEvaluator_<T>
    {
        public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification_<T> spec)
        {
            var query = inputQuery;

            if (spec.Criteria_ != null)
                query = query.Where(spec.Criteria_);

            // relations
            // query = spec.Includes.Aggregate(query, (current, include) 
            // => current.Include(include));

            return query;
        }
    }

    interface IGenericRepository_<T>
    {
        T GetById_(ISpecification_<T> spec);
        List<T> ListAll_(ISpecification_<T> spec);
    }

    class GenericRepository_<T> : IGenericRepository_<T>
    {
        private readonly List<T> _context;

        public GenericRepository_(List<T> context)
           => _context = context;

        public T GetById_(ISpecification_<T> spec)
        {
            return ApplySpecification_(spec).FirstOrDefault();
        }

        public List<T> ListAll_(ISpecification_<T> spec)
        {
            return ApplySpecification_(spec).ToList();
        }

        private IQueryable<T> ApplySpecification_(ISpecification_<T> spec)
        {
            return SpecificationEvaluator_<T>.GetQuery(_context.AsQueryable(), spec);
        }
    }

    public class GenericAndSpecificationPatternDemo
    {
        static void Main()
    {
        var productData = new List<Product_>()
        {
            new Product_ { Id = 1, Name = "one" },
            new Product_ { Id = 2, Name = "two" },
            new Product_ { Id = 3, Name = "three" },
        };

        var genericRepository = new GenericRepository_<Product_>(productData);

        var spec = new GetProductSpecification_(2);
        var product = genericRepository.GetById_(spec);
        Console.WriteLine($"Single element:{product.Name}");

        Console.WriteLine();

        var spec2 = new GetProductSpecification_();
        var products = genericRepository.ListAll_(spec2);
        foreach (var p in products)
            Console.WriteLine($"{p.Id}.{p.Name}");
    }
    }
}