from google.adk.agents import Agent


web_page_agent = Agent(
    name = "web_page_agent",
    description = "Generates web page content for a given topic",
    tools = [],
    output_key = "webpage_content",
)