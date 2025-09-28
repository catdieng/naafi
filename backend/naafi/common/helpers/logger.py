import os

import structlog

DEBUG = os.getenv("DEBUG", "false").lower() in ["true", "1"]

# structlog.configure(
#     processors=[
#         structlog.processors.TimeStamper(fmt="iso"),
#         structlog.stdlib.add_log_level,
#         structlog.processors.StackInfoRenderer(),
#         structlog.processors.format_exc_info,
#         structlog.dev.ConsoleRenderer() if DEBUG else structlog.processors.JSONRenderer(),
#     ],
#     context_class=dict,
#     logger_factory=structlog.stdlib.LoggerFactory(),
#     wrapper_class=structlog.stdlib.BoundLogger,
#     cache_logger_on_first_use=True,
# )


# Helper function
def get_logger(name: str = None):
    return structlog.get_logger(name)


logger = get_logger(__name__)
