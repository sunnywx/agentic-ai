from dotenv import load_dotenv, find_dotenv
from swarm import Swarm, Agent

load_dotenv(find_dotenv())


client = Swarm()

def transfer_to_agent_b():
    return agent_b


agent_a = Agent(
    name="Agent A",
    model='gpt-3.5-turbo',
    instructions="You are a helpful agent.",
    functions=[transfer_to_agent_b],
)

def b_instructions(ctx_vars):
   print('ctx vars: ', ctx_vars)
   user_name=ctx_vars['user']
   return f"Only speak Chinese, your name is {user_name}. Do whatever you want."

agent_b = Agent(
    name="Agent B",
    model='gpt-3.5-turbo',
    # instructions="Only speak in chinese",
    instructions=b_instructions,
)

def run_basic():
  response = client.run(
      agent=agent_a,
      messages=[
        {"role": "user", "content": "I want to talk to agent B."},
        # {"role": "user", "content": "what is your name"}
      ],
      debug=True,
      context_variables={
         "user": "sunny"
      }
  )

  # print('Resp: ', response)

  print(response.messages[-1]["content"])

def run_stream_mode():
  stream = client.run(
      agent=agent_a,
      messages=[
        {"role": "user", "content": "I want to talk to agent B."},
        # {"role": "user", "content": "what is open ai"},
      ],
      stream=True,
      debug=True
  )

  for chunk in stream:
     print(chunk)

def greet(vars, lang):
  user_name=vars['user']
  greeting=f"Hello, {user_name}"
  print(greeting)
  return 'Done'
  
def run_func():
   agent=Agent(
      # functions=[print_hello]
   )

   resp=client.run(
      agent=agent,
      messages=[
         {'role': 'user', 'content': 'Use greet func'}
      ],
      context_variables={'user': 'sunny'},
      debug=True
   )

   print(resp.messages[-1]['content'])

run_basic()

# run_stream_mode()

'''not work'''
# run_func()

