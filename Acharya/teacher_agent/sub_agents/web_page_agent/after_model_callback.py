from google.adk.models import LlmResponse
from google.adk.agents.callback_context import CallbackContext
from google.genai import types

def citation_retrieval_after_model_callback(
    llm_response: LlmResponse,
    callback_context: CallbackContext,) -> LlmResponse:
    """Adds citations to the response if grounding metadata is present."""
    
    # Check if grounding_metadata exists
    if not llm_response.grounding_metadata:
        print("1")
        return llm_response
    
    # Check if grounding_chunks exists
    chunks = llm_response.grounding_metadata.grounding_chunks
    if not chunks:
        print("2")
        return llm_response
    
    # Check if content and parts exist
    if not llm_response.content or not llm_response.content.parts:
        print("3")
        return llm_response
    
    parts = list(llm_response.content.parts)  # Create a copy to modify
    
    citation_text = "\n\n## References\n"
    count = 0

    for chunk in chunks:
        if chunk.web and count < 5:
            url = chunk.web.uri
            title = chunk.web.title
            if url and title:  # Only add if both exist
                citation_text += f"- [{title}]({url})\n"
                count += 1
        
        if count >= 5:
            break
    
    # Only add references section if we found citations
    if count > 0:
        parts.append(types.Part(text=citation_text))
        return LlmResponse(content=types.Content(parts=parts))
    
    return llm_response