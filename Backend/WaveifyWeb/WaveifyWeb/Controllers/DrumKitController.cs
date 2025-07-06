using Microsoft.AspNetCore.Mvc;
using Waveify.API.Contracts;
using Waveify.Application.Interfaces.Repositories;

using Waveify.Core.Models;

namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DrumKitController : ControllerBase
    {
        private readonly IDrumKitServices _drumKitServices;

        public DrumKitController(IDrumKitServices drumKitServices)
        {
            _drumKitServices = drumKitServices;
        }
        [HttpGet]
        public async Task<ActionResult<List<DrumKitResponse>>> GetDrumKits()
        {
            var drumKits = await _drumKitServices.GetAllDrumKits();
            var responce = drumKits.Select(d => new DrumKitResponse(
                d.Id, d.Title, d.Description, d.Url, d.Price));
            return Ok(responce);
        }
        [HttpPost]
        public async Task<ActionResult<Guid>> CreateDrumKit([FromBody] DrumKitRequest request)
        {
            var (drumKit, error) = DrumKit.Create(Guid.NewGuid(),
                request.title,
                request.description,
                request.url,
                request.price);
            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }
            var drumKitId = await _drumKitServices.CreateDrumKit(drumKit);
            return Ok(drumKitId);
        }
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Guid>> UpdateDrumKit(Guid id, [FromBody] DrumKitRequest request)
        {
            var drumKitId = await _drumKitServices.UpdateDrumKit(id, request.title, request.description, request.url, request.price);

            return Ok(drumKitId);
        }

        [HttpDelete("{id:Guid}")]
        public async Task<ActionResult<Guid>> DeleteDrumKit(Guid id)
        {
            return Ok(await _drumKitServices.DeleteDrumKit(id));
        }
    }
}