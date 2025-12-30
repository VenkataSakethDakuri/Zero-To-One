from google.adk.agents import ParallelAgent



factory_agent = ParallelAgent(
    name="factory_agent",
    description="Factory agent that creates agents for each subtopic",
    # sub_agents will be set in the main workflow
)
